import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ParametersPipe } from 'src/common/pipes/parameters.pipe'

import { UserRequest } from '../session/session.controller'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { TicketService } from './ticket.service'

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.ticketService.findAll()
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParametersPipe) id: string) {
    return await this.ticketService.findOne(id)
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @Request() { user }: { user: UserRequest }
  ) {
    return await this.ticketService.create(createTicketDto, user.userId)
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async update(@Param('id', ParametersPipe) id: string, @Body() updateTicketDto: UpdateTicketDto) {
    await this.ticketService.update(updateTicketDto, id)
  }

  @Delete(':id')
  async delete(@Param('id', ParametersPipe) id: string) {
    await this.ticketService.delete(id)
  }
}
