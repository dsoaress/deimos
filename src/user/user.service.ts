import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { compare, hash } from 'bcryptjs'
import { Repository } from 'typeorm'

import { MailerService } from '../mailer/mailer.service'
import { TokenService } from '../token/token.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userService: Repository<User>,
    private tokenService: TokenService,
    private mailerService: MailerService
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userService.find()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userService.findOne(id, { relations: ['teams', 'lastTeamViewed'] })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userService.findOne({ email })

    if (!user) {
      throw new BadRequestException()
    }

    return user
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { email, password } = createUserDto

    const emailExists = await this.userService.findOne({ email })

    if (emailExists) {
      throw new BadRequestException('Email already registered')
    }

    const user = this.userService.create({
      ...createUserDto,
      password: await hash(password, 8)
    })

    await this.userService.save(user)
    const { token } = await this.tokenService.create(user.id)

    this.mailerService.sendVerificationEmail(user, token)
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { oldPassword, password } = updateUserDto
    const user = await this.findOne(id)

    if (password) {
      if (!oldPassword) {
        throw new BadRequestException('Current password is required in password change')
      }

      if (password.length < 8) {
        throw new BadRequestException('Passwords need to have at least 8 characters')
      }

      const checkPasswords = await compare(oldPassword, user.password)

      if (!checkPasswords) {
        throw new BadRequestException('Passwords do not match')
      }

      delete updateUserDto.oldPassword
      updateUserDto.password = await hash(password, 8)
    }

    await this.userService.update(id, updateUserDto)
  }

  async setEmailVerificationStatus(id: string): Promise<void> {
    await this.userService.update(id, { verified: true })
  }

  async resetPassword(id: string, password: string): Promise<void> {
    await this.findOne(id)
    await this.userService.update(id, { password: await hash(password, 8) })
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id)
    await this.userService.delete({ id })
  }
}
