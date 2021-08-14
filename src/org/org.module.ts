import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SubscriptionModule } from '../subscription/subscription.module'
import { OrgController } from './org.controller'
import { Org } from './org.entity'
import { OrgService } from './org.service'

@Module({
  imports: [TypeOrmModule.forFeature([Org]), SubscriptionModule],
  providers: [OrgService],
  controllers: [OrgController]
})
export class OrgModule {}
