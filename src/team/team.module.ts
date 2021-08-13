import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SubscriptionModule } from '../subscription/subscription.module'
import { TeamController } from './team.controller'
import { Team } from './team.entity'
import { TeamService } from './team.service'

@Module({
  imports: [TypeOrmModule.forFeature([Team]), SubscriptionModule],
  providers: [TeamService],
  controllers: [TeamController]
})
export class TeamModule {}
