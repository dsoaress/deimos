import { CacheInterceptor, CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import * as redisStore from 'cache-manager-redis-store'

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
    CacheModule.register({
      store: redisStore,
      host: process.env.REDISHOST ?? '',
      port: process.env.REDISPORT ?? '',
      auth_pass: process.env.REDISPASSWORD ?? ''
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
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
