import { Module } from '@nestjs/common'

import { MailerModule } from '../mailer/mailer.module'
import { SessionModule } from '../session/session.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [UsersModule, SessionModule, MailerModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
