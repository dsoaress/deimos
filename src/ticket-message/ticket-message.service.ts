import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateTicketMessageDto } from './dto/create-ticket-message.dto'
import { UpdateTicketMessageDto } from './dto/update-ticket-message.dto'
import { TicketMessage } from './ticket-message.entity'

@Injectable()
export class TicketMessageService {
  constructor(
    @InjectRepository(TicketMessage)
    private ticketMessageService: Repository<TicketMessage>
  ) {}

  async findOne(id: string) {
    const ticketMessage = await this.ticketMessageService.findOne(id)

    if (!ticketMessage) {
      throw new NotFoundException('Ticket message not found')
    }

    return ticketMessage
  }

  async create(createTicketMessageDto: CreateTicketMessageDto, userId: string) {
    const ticket = this.ticketMessageService.create({
      ...createTicketMessageDto,
      user: { id: userId }
    })

    await this.ticketMessageService.save(ticket)

    return ticket
  }

  async update(updateTicketMessageDto: UpdateTicketMessageDto, id: string) {
    await this.findOne(id)
    await this.ticketMessageService.update(id, updateTicketMessageDto)
  }

  async delete(id: string) {
    await this.findOne(id)
    await this.ticketMessageService.delete(id)
  }
}
