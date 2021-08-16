import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TicketController } from './ticket.controller'
import { Ticket } from './ticket.entity'
import { TicketService } from './ticket.service'

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  providers: [TicketService],
  controllers: [TicketController]
})
export class TicketModule {}
