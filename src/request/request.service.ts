import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateRequestDto } from './dto/create-request.dto'
import { UpdateRequestDto } from './dto/update-request.dto'
import { Request } from './request.entity'

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestService: Repository<Request>
  ) {}

  async findAll() {
    return await this.requestService.find({ relations: ['user', 'designer', 'org'] })
  }

  async findOne(id: string) {
    const request = await this.requestService.findOne(id, {
      relations: ['user', 'designer', 'org']
    })

    if (!request) {
      throw new NotFoundException('Request not found')
    }

    return request
  }

  async create(createRequestDto: CreateRequestDto, userId: string) {
    const request = this.requestService.create({
      ...createRequestDto,
      user: { id: userId }
    })

    await this.requestService.save(request)

    return request
  }

  async update(updateRequestDto: UpdateRequestDto, id: string) {
    await this.findOne(id)
    this.requestService.update(id, updateRequestDto)
  }

  async delete(id: string) {
    await this.findOne(id)
    await this.requestService.delete(id)
  }
}
