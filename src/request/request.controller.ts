import { Patch } from '@nestjs/common'
import { Delete } from '@nestjs/common'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'

import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { UserRequest } from '../session/session.controller'
import { CreateRequestDto } from './dto/create-request.dto'
import { UpdateRequestDto } from './dto/update-request.dto'
import { RequestService } from './request.service'

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  async findAll() {
    return await this.requestService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParametersPipe) id: string) {
    return await this.requestService.findOne(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Request() { user }: { user: UserRequest }
  ) {
    return await this.requestService.create(createRequestDto, user.userId)
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updateRequestDto: UpdateRequestDto,
    @Param('id', ParametersPipe) id: string
  ) {
    await this.requestService.update(updateRequestDto, id)
  }

  @Delete(':id')
  async delete(@Param('id', ParametersPipe) id: string) {
    await this.requestService.delete(id)
  }
}
