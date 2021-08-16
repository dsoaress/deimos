import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TicketMessageController } from './ticket-message.controller'
import { TicketMessage } from './ticket-message.entity'
import { TicketMessageService } from './ticket-message.service'

@Module({
  imports: [TypeOrmModule.forFeature([TicketMessage])],
  providers: [TicketMessageService],
  controllers: [TicketMessageController]
})
export class TicketMessageModule {}
