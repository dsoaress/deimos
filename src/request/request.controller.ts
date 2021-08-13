import { Patch } from '@nestjs/common'
import { Delete } from '@nestjs/common'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'

import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard'
import { UserRequest } from '../session/session.controller'
import { CreateRequestDto } from './dto/create-request.dto'
import { UpdateRequestDto } from './dto/update-request.dto'
import { Request as RequestEntity } from './request.entity'
import { RequestService } from './request.service'

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<RequestEntity[]> {
    return await this.requestService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParametersPipe) id: string): Promise<RequestEntity> {
    return await this.requestService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Request() { user }: { user: UserRequest }
  ): Promise<RequestEntity> {
    return await this.requestService.create(createRequestDto, user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updateRequestDto: UpdateRequestDto,
    @Param('id', ParametersPipe) id: string
  ): Promise<void> {
    await this.requestService.update(updateRequestDto, id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParametersPipe) id: string): Promise<void> {
    await this.requestService.delete(id)
  }
}
