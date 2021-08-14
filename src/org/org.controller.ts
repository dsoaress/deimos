import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'

import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard'
import { UserRequest } from '../session/session.controller'
import { CreateOrgDto } from './dto/create-org.dto'
import { UpdateOrgDto } from './dto/update-org.dto'
import { Org } from './org.entity'
import { OrgService } from './org.service'

@Controller('orgs')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Org[]> {
    return await this.orgService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParametersPipe) id: string): Promise<Org> {
    return await this.orgService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createOrgDto: CreateOrgDto,
    @Request() { user }: { user: UserRequest }
  ): Promise<Org> {
    return await this.orgService.create(createOrgDto, user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParametersPipe) id: string,
    @Body() updateOrgDto: UpdateOrgDto
  ): Promise<void> {
    await this.orgService.update(updateOrgDto, id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParametersPipe) id: string): Promise<void> {
    await this.orgService.delete(id)
  }
}
