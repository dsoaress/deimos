import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

import { Ticket } from '../../ticket/ticket.entity'

export class CreateTicketMessageDto {
  @IsUUID()
  @IsNotEmpty()
  ticket!: Ticket

  @IsString()
  @IsNotEmpty()
  message!: string
}
