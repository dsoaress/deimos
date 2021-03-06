import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateOrgDto } from './dto/create-org.dto'
import { UpdateOrgDto } from './dto/update-org.dto'
import { Org } from './org.entity'

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Org)
    private orgService: Repository<Org>
  ) {}

  async findAll() {
    return await this.orgService.find()
  }

  async findOne(id: string) {
    const org = await this.orgService.findOne(id, {
      relations: ['users', 'brands', 'invites']
    })

    if (!org) {
      throw new NotFoundException('Org not found')
    }

    return org
  }

  async create(createOrgDto: CreateOrgDto, userId: string) {
    const org = this.orgService.create({
      ...createOrgDto,
      owner: { id: userId }
    })

    await this.orgService.save(org)
    return org
  }

  async update(updateOrgDto: UpdateOrgDto, id: string) {
    await this.findOne(id)
    await this.orgService.update(id, updateOrgDto)
  }

  async delete(id: string) {
    await this.findOne(id)
    await this.orgService.delete(id)
  }
}
