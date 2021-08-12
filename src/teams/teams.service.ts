import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from '../users/schema/user.schema'
import { UsersService } from '../users/users.service'
import { CreateTeamDto } from './dto/create-team.dto'
import { Team, TeamDocument } from './schema/team.schema'

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel('Team') private teamModel: Model<TeamDocument>,
    private usersService: UsersService
  ) {}

  async findAll(): Promise<Team[]> {
    return await this.teamModel.find()
  }

  async findOne(_id: string): Promise<Team> {
    const team = await this.teamModel.findOne({ _id })

    if (!team) {
      throw new NotFoundException('Team not found')
    }

    return team
  }

  async create(createTeamDto: CreateTeamDto, userId: string): Promise<Team> {
    const createdTeam = new this.teamModel({
      ...createTeamDto,
      users: [{ user: userId, permission: 'owner' }]
    })
    const team = await createdTeam.save()

    return team
  }
}
