import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SessionSchema } from './schema/session.schema'
import { SessionController } from './session.controller'
import { SessionService } from './session.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }])],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService]
})
export class SessionModule {}
