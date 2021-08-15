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

import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { UserRequest } from '../session/session.controller'
import { CreateOrgDto } from './dto/create-org.dto'
import { UpdateOrgDto } from './dto/update-org.dto'
import { Org } from './org.entity'
import { OrgService } from './org.service'

@Controller('orgs')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(): Promise<Org[]> {
    return await this.orgService.findAll()
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParametersPipe) id: string): Promise<Org> {
    return await this.orgService.findOne(id)
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createOrgDto: CreateOrgDto,
    @Request() { user }: { user: UserRequest }
  ): Promise<Org> {
    return await this.orgService.create(createOrgDto, user.userId)
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParametersPipe) id: string,
    @Body() updateOrgDto: UpdateOrgDto
  ): Promise<void> {
    await this.orgService.update(updateOrgDto, id)
  }

  @Delete(':id')
  async delete(@Param('id', ParametersPipe) id: string): Promise<void> {
    await this.orgService.delete(id)
  }
}
