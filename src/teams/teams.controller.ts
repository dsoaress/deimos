import { Post, Request, UsePipes } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { Body } from '@nestjs/common'
import { Param } from '@nestjs/common'

import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard'
import { UserRequest } from './../session/session.controller'
import { CreateTeamDto } from './dto/create-team.dto'
import { Team } from './schema/team.schema'
import { TeamsService } from './teams.service'

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Team[]> {
    return await this.teamsService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  async findOne(@Param('_id', ParametersPipe) _id: string): Promise<Team> {
    return await this.teamsService.findOne(_id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @Request() { user }: { user: UserRequest }
  ): Promise<Team> {
    return await this.teamsService.create(createTeamDto, user.userId)
  }
}
