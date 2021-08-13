import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { SubscriptionService } from '../subscription/subscription.service'
import { CreateTeamDto } from './dto/create-team.dto'
import { Team } from './team.entity'

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamService: Repository<Team>,
    private subscriptionService: SubscriptionService
  ) {}

  async findAll(): Promise<Team[]> {
    return await this.teamService.find()
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamService.findOne(id, {
      relations: ['accountManager', 'subscription', 'users', 'brands', 'invites']
    })

    if (!team) {
      throw new NotFoundException('Team not found')
    }

    return team
  }

  async create(createTeamDto: CreateTeamDto, userId: string): Promise<Team> {
    const team = this.teamService.create({
      ...createTeamDto,
      users: [{ id: userId }],
      subscription: this.teamService.create()
    })

    await this.teamService.save(team)
    // await this.subscriptionService.create(team.id)

    return team
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id)
    await this.teamService.delete(id)
  }
}
