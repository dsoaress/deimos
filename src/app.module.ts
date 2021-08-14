import { CacheInterceptor, CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as redisStore from 'cache-manager-redis-store'

import { AppController } from './app.controller'
import { Brand } from './brand/brand.entity'
import { BrandModule } from './brand/brand.module'
import { File } from './file/file.entity'
import { FileModule } from './file/file.module'
import { Invite } from './invite/invite.entity'
import { InviteModule } from './invite/invite.module'
import { MailerModule } from './mailer/mailer.module'
import { Message } from './message/message.entity'
import { MessageModule } from './message/message.module'
import { Notification } from './notification/notification.entity'
import { NotificationModule } from './notification/notification.module'
import { Org } from './org/org.entity'
import { OrgModule } from './org/org.module'
import { Request } from './request/request.entity'
import { RequestModule } from './request/request.module'
import { JwtAuthGuard } from './session/guards/jwt-auth.guard'
import { Session } from './session/session.entity'
import { SessionModule } from './session/session.module'
import { Subscription } from './subscription/subscription.entity'
import { SubscriptionModule } from './subscription/subscription.module'
import { Token } from './token/token.entity'
import { TokenModule } from './token/token.module'
import { User } from './user/user.entity'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL ?? '',
      entities: [
        User,
        Org,
        Subscription,
        Request,
        Message,
        Brand,
        Invite,
        Token,
        Session,
        File,
        Notification
      ],
      synchronize: true
    }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDISHOST ?? '',
      port: process.env.REDISPORT ?? '',
      auth_pass: process.env.REDISPASSWORD ?? ''
    }),
    UserModule,
    OrgModule,
    SessionModule,
    MailerModule,
    TokenModule,
    RequestModule,
    FileModule,
    InviteModule,
    BrandModule,
    SubscriptionModule,
    MessageModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor }
  ]
})
export class AppModule {}
