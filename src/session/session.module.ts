import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersModule } from '../users/users.module'
import { SessionSchema } from './schema/session.schema'
import { SessionController } from './session.controller'
import { SessionService } from './session.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]), UsersModule],
  providers: [SessionService],
  controllers: [SessionController]
})
export class SessionModule {}
