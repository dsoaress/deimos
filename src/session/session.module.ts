import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TokenModule } from '../token/token.module'
import { UserModule } from '../user/user.module'
import { SessionController } from './session.controller'
import { Session } from './session.entity'
import { SessionService } from './session.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' }
      }),
      inject: [ConfigService]
    }),
    UserModule,
    TokenModule,
    PassportModule
  ],
  providers: [SessionService, LocalStrategy, JwtStrategy],
  controllers: [SessionController]
})
export class SessionModule {}
