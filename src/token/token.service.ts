import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Token } from './token.entity'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenService: Repository<Token>
  ) {}

  async findOne(token: string) {
    const tokenExists = await this.tokenService.findOne(token, { relations: ['user'] })

    if (!tokenExists) {
      throw new NotFoundException('Token not found')
    }

    return tokenExists
  }

  async create(userId: string) {
    const token = this.tokenService.create({
      user: { id: userId }
    })

    await this.tokenService.save(token)

    return token
  }

  async delete(token: string) {
    await this.findOne(token)
    await this.tokenService.delete(token)
  }
}
