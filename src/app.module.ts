import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

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
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    UsersModule,
    TeamsModule,
    SessionModule,
    MailerModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
