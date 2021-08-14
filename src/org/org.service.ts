import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserService } from '../user/user.service'
import { CreateOrgDto } from './dto/create-org.dto'
import { UpdateOrgDto } from './dto/update-org.dto'
import { Org } from './org.entity'

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Org)
    private orgService: Repository<Org>,
    private userService: UserService
  ) {}

  async findAll(): Promise<Org[]> {
    return await this.orgService.find()
  }

  async findOne(id: string): Promise<Org> {
    const org = await this.orgService.findOne(id, {
      relations: ['accountManager', 'subscription', 'users', 'brands', 'invites']
    })

    if (!org) {
      throw new NotFoundException('Org not found')
    }

    return org
  }

  async create(createOrgDto: CreateOrgDto, userId: string): Promise<Org> {
    const org = this.orgService.create({
      ...createOrgDto,
      users: [{ id: userId }],
      subscription: this.orgService.create()
    })

    await this.orgService.save(org)
    return org
  }

  async update(updateOrgDto: UpdateOrgDto, id: string): Promise<void> {
    await this.findOne(id)
    await this.orgService.update(id, updateOrgDto)
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id)
    await this.orgService.delete(id)
  }
}
