import { Module } from '@nestjs/common'

import { TeamsModule } from './teams/teams.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [UsersModule, TeamsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
