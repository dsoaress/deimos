import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'

import { UserRequest } from '../session/session.controller'
import { ParametersPipe } from './../common/pipes/parameters.pipe'
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto'
import { UpdateTicketMessageDto } from './dto/update-ticket-message.dto'
import { TicketMessageService } from './ticket-message.service'

@Controller('ticket-messages')
export class TicketMessageController {
  constructor(private readonly ticketMessageService: TicketMessageService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createTicketMessageDto: CreateTicketMessageDto,
    @Request() { user }: { user: UserRequest }
  ) {
    return await this.ticketMessageService.create(createTicketMessageDto, user.userId)
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParametersPipe) id: string,
    @Body() updateTicketMessageDto: UpdateTicketMessageDto
  ) {
    await this.ticketMessageService.update(updateTicketMessageDto, id)
  }

  @Delete(':id')
  async delete(@Param('id', ParametersPipe) id: string) {
    await this.ticketMessageService.delete(id)
  }
}
