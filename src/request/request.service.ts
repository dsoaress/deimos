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

  async findAll(): Promise<Request[]> {
    return await this.requestService.find({ relations: ['user', 'designer', 'team'] })
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestService.findOne(id, {
      relations: ['user', 'designer', 'team']
    })

    if (!request) {
      throw new NotFoundException('Request not found')
    }

    return request
  }

  async create(createRequestDto: CreateRequestDto, userId: string): Promise<Request> {
    const request = this.requestService.create({
      ...createRequestDto,
      user: { id: userId }
    })

    await this.requestService.save(request)

    return request
  }

  async update(updateRequestDto: UpdateRequestDto, id: string): Promise<void> {
    await this.findOne(id)
    this.requestService.update(id, updateRequestDto)
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id)
    await this.requestService.delete(id)
  }
}
