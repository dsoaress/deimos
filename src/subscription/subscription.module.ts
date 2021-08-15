import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { OrgModule } from '../org/org.module'
import { StripeModule } from '../stripe/stripe.module'
import { SubscriptionController } from './subscription.controller'
import { Subscription } from './subscription.entity'
import { SubscriptionService } from './subscription.service'

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), OrgModule, StripeModule],
  providers: [SubscriptionService],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}
