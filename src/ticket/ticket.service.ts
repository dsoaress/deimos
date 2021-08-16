import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { Ticket } from './ticket.entity'

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketService: Repository<Ticket>
  ) {}

  async findAll() {
    return await this.ticketService.find()
  }

  async findOne(id: string) {
    const ticket = await this.ticketService.findOne(id, {
      relations: ['ticketMessages']
    })

    if (!ticket) {
      throw new NotFoundException('Ticket not found')
    }

    return ticket
  }

  async create(createTicketDto: CreateTicketDto, userId: string) {
    const { area, message, subject } = createTicketDto

    const ticket = this.ticketService.create({
      client: { id: userId },
      area,
      subject,
      ticketMessages: [{ message, user: { id: userId } }]
    })

    await this.ticketService.save(ticket)

    return ticket
  }

  async update(updateTicketDto: UpdateTicketDto, id: string) {
    await this.findOne(id)
    await this.ticketService.update(id, updateTicketDto)
  }

  async delete(id: string) {
    await this.findOne(id)
    await this.ticketService.delete(id)
  }
}
