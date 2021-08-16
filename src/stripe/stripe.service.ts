import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Request } from 'express'
import { Readable } from 'stream'
import Stripe from 'stripe'

import { Org } from '../org/org.entity'
import { constants } from './constants'

@Injectable()
export class StripeService {
  async findStripeSubscriptionStatus(stripeSubscriptionId: string) {
    const stripe = this.stripeClient()
    const { status } = await stripe.subscriptions.retrieve(stripeSubscriptionId)

    return status
  }

  async findStripeSubscription(stripeCustomerId: string, stripeSubscriptionId: string) {
    const stripe = this.stripeClient()
    const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)

    if (!stripeSubscription) {
      throw new NotFoundException('Stripe subscription not found')
    }

    const planId = stripeSubscription.items.data[0].plan.product?.toString()

    if (!planId) {
      throw new NotFoundException('This Subscription does not have a default_payment_method')
    }

    const stripePlanDetails = await stripe.products.retrieve(planId)

    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'card'
    })

    const invoices = await stripe.invoices.list({
      subscription: stripeSubscriptionId
    })

    return {
      planId,
      name: stripePlanDetails.name,
      description: stripePlanDetails.description,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      currency: stripeSubscription.items.data[0].plan.currency,
      amount:
        stripeSubscription.items.data[0].plan.amount &&
        stripeSubscription.items.data[0].plan.amount / 100,
      interval: stripeSubscription.items.data[0].plan.interval,
      intervalId: stripeSubscription.items.data[0].plan.id,
      invoices: invoices.data.map(invoice => {
        return {
          id: invoice.id,
          currency: invoice.currency,
          amount: invoice.amount_paid / 100,
          date: new Date(invoice.created * 1000),
          pdf: invoice.invoice_pdf
        }
      }),
      paymentMethods: paymentMethods.data.map(method => {
        return {
          id: method.id,
          card: method.card?.brand,
          last4: method.card?.last4,
          expMonth: method.card?.exp_month,
          expYear: method.card?.exp_year,
          country: method.card?.country
        }
      })
    }
  }

  async createStripeCustomer(org: Org) {
    const stripe = this.stripeClient()

    const { id: stripeCustomerId } = await stripe.customers.create({
      name: `${org.owner.firstName} ${org.owner.lastName} - ${org.name}`,
      email: org.owner.email
    })

    return stripeCustomerId
  }

  async createStripeCheckoutSession(stripeCustomerId: string, planId: string) {
    const stripe = this.stripeClient()

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      line_items: [
        {
          price: planId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: constants.cancelUrl,
      cancel_url: constants.cancelUrl
    })

    if (!stripeCheckoutSession.url) {
      throw new BadGatewayException('Stripe checkout error')
    }

    return stripeCheckoutSession.url
  }

  async checkoutSessionComplete(event: Stripe.Event) {
    const checkoutSession = event.data.object as Stripe.Checkout.Session

    if (!checkoutSession.subscription || !checkoutSession.customer) {
      throw new BadRequestException()
    }

    const stripeCustomerId = checkoutSession.customer.toString()
    const stripeSubscriptionId = checkoutSession.subscription.toString()
    const stripeSubscriptionStatus = await this.findStripeSubscriptionStatus(stripeSubscriptionId)

    return { stripeCustomerId, stripeSubscriptionId, stripeSubscriptionStatus }
  }

  async subscriptionUpdate(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription
    const stripeCustomerId = subscription.customer.toString()
    const stripeSubscriptionId = subscription.id
    const stripeSubscriptionStatus = await this.findStripeSubscriptionStatus(stripeSubscriptionId)

    return { stripeCustomerId, stripeSubscriptionId, stripeSubscriptionStatus }
  }

  async readBuffer(request: Request) {
    const stripe = this.stripeClient()

    async function buffer(readable: Readable) {
      const chunks = []

      for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
      }

      return Buffer.concat(chunks)
    }

    const buf = await buffer(request)
    const secret = request.headers['stripe-signature'] as string | Buffer | string[]

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf, secret, constants.webhookSecret)
    } catch (err) {
      throw new BadRequestException(err.message)
    }

    return event
  }

  stripeClient() {
    return new Stripe(constants.apiKey, { apiVersion: '2020-08-27' })
  }
}
