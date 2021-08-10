import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { TeamsModule } from './teams/teams.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27018/deimos', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    UsersModule,
    TeamsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
