import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateTeamDto } from './dto/create-team.dto'
import { Team } from './team.entity'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamService: Repository<Team>
  ) {}

  async findAll(): Promise<Team[]> {
    return await this.teamService.find()
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamService.findOne(id)

    if (!team) {
      throw new NotFoundException('Team not found')
    }

    return team
  }

  async create(createTeamDto: CreateTeamDto, userId: string): Promise<Team> {
    const team = this.teamService.create({
      ...createTeamDto,
      users: [{ id: userId }]
    })

    await this.teamService.save(team)

    return team
  }
}
