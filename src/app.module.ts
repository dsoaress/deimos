import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { MailerModule } from './mailer/mailer.module'
import { SessionModule } from './session/session.module'
import { TeamsModule } from './teams/teams.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URL ?? '', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    UsersModule,
    TeamsModule,
    SessionModule,
    MailerModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
