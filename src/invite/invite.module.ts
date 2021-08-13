import { Module } from '@nestjs/common'

import { InviteController } from './invite.controller'
import { InviteService } from './invite.service'

@Module({
  providers: [InviteService],
  controllers: [InviteController]
})
export class InviteModule {}
