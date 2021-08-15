import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Repository } from 'typeorm'

import { OrgService } from '../org/org.service'
import { StripeService } from '../stripe/stripe.service'
import { Subscription } from './subscription.entity'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionService: Repository<Subscription>,
    private orgService: OrgService,
    private stripeService: StripeService
  ) {}

  async findAll() {
    return await this.subscriptionService.find()
  }

  async findOne(id: string) {
    const subscription = await this.subscriptionService.findOne(id)

    if (!subscription) {
      throw new NotFoundException('Subscription not found')
    }

    if (subscription.status !== 'active') {
      return { ...subscription }
    }

    if (!subscription.stripeSubscriptionId) {
      throw new NotFoundException('Stripe subscription not found')
    }

    const stripe = await this.stripeService.findStripeSubscription(
      subscription.stripeCustomerId,
      subscription.stripeSubscriptionId
    )

    return { ...subscription, stripe }
  }

  async create(orgId: string) {
    const org = await this.orgService.findOne(orgId)

    if (org.subscription) {
      throw new BadRequestException('There is already a subscription linked to this organization')
    }

    const stripeCustomerId = await this.stripeService.createStripeCustomer(org)

    const subscription = this.subscriptionService.create({
      org: { id: orgId },
      stripeCustomerId
    })

    const stripeCheckoutSessionUrl = await this.stripeService.createStripeCheckoutSession(
      stripeCustomerId,
      'price_1JOWarJpYlPaBPcbKdaTFcsP'
    )

    await this.subscriptionService.save(subscription)
    return stripeCheckoutSessionUrl
  }

  async webhooks(request: Request): Promise<void> {
    const event = await this.stripeService.readBuffer(request)

    const relevantEvents = new Set([
      'checkout.session.completed',
      'customer.subscription.updated',
      'customer.subscription.deleted'
    ])

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscriptionUpdate = await this.stripeService.subscriptionUpdate(event)

            await this.saveSubscription(
              subscriptionUpdate.stripeCustomerId,
              subscriptionUpdate.stripeSubscriptionId,
              subscriptionUpdate.stripeSubscriptionStatus
            )

            break

          case 'checkout.session.completed':
            const checkoutSessionComplete = await this.stripeService.checkoutSessionComplete(event)

            await this.saveSubscription(
              checkoutSessionComplete.stripeCustomerId,
              checkoutSessionComplete.stripeSubscriptionId,
              checkoutSessionComplete.stripeSubscriptionStatus
            )

            break

          default:
            throw new BadGatewayException('Unhandled event.')
        }
      } catch {
        throw new BadGatewayException('Unhandled event.')
      }
    }
  }

  private async saveSubscription(
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    stripeSubscriptionStatus: string
  ) {
    const subscription = await this.subscriptionService.findOne({
      stripeCustomerId
    })

    if (!subscription) {
      throw new NotFoundException('Subscription not found')
    }

    await this.subscriptionService.update(subscription.id, {
      status: stripeSubscriptionStatus,
      stripeSubscriptionId
    })
  }
}
