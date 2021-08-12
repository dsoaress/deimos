import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersModule } from '../users/users.module'
import { TeamSchema } from './schema/team.schema'
import { TeamsController } from './teams.controller'
import { TeamsService } from './teams.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }]), UsersModule],
  providers: [TeamsService],
  controllers: [TeamsController]
})
export class TeamsModule {}
