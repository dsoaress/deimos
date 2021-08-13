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
import { UserRequest } from './../session/session.controller'
import { CreateTeamDto } from './dto/create-team.dto'
import { Team } from './team.entity'
import { TeamService } from './team.service'

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Team[]> {
    return await this.teamService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParametersPipe) id: string): Promise<Team> {
    return await this.teamService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @Request() { user }: { user: UserRequest }
  ): Promise<Team> {
    return await this.teamService.create(createTeamDto, user.userId)
  }
}
