import { CacheInterceptor, CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as redisStore from 'cache-manager-redis-store'

import { AppController } from './app.controller'
import { MailerModule } from './mailer/mailer.module'
import { Request } from './request/request.entity'
import { RequestModule } from './request/request.module'
import { Session } from './session/session.entity'
import { SessionModule } from './session/session.module'
import { Team } from './team/team.entity'
import { TeamModule } from './team/team.module'
import { Token } from './token/token.entity'
import { TokenModule } from './token/token.module'
import { User } from './user/user.entity'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL ?? '',
      entities: [User, Team, Request, Token, Session],
      synchronize: true
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
    UserModule,
    TeamModule,
    SessionModule,
    MailerModule,
    TokenModule,
    RequestModule
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
