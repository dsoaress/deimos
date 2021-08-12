import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'

import { MailerModule } from '../mailer/mailer.module'
import { UsersModule } from '../users/users.module'
import { SessionSchema } from './schema/session.schema'
import { SessionController } from './session.controller'
import { SessionService } from './session.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    MailerModule,
    PassportModule
  ],
  providers: [SessionService, LocalStrategy, JwtStrategy],
  controllers: [SessionController]
})
export class SessionModule {}
