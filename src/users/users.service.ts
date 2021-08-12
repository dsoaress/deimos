import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { compare, hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import { v4 as uuid } from 'uuid'

import { MailerService } from './../mailer/mailer.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './schema/user.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private mailerService: MailerService
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find()
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email })

    if (!user) {
      throw new BadRequestException()
    }

    return user
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { email, password } = createUserDto

    const emailExists = await this.userModel.findOne({ email })

    if (emailExists) {
      throw new BadRequestException('Email already registered')
    }

    createUserDto.password = await hash(password, 8)
    createUserDto.emailVerificationToken = {
      token: uuid(),
      expiresIn: dayjs().add(30, 'days').unix()
    }

    const createdUser = new this.userModel(createUserDto)
    const user = await createdUser.save()
    this.mailerService.sendVerificationEmail(user)
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { oldPassword, password } = updateUserDto
    const user = await this.findOne(_id)

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

    await this.userModel.findByIdAndUpdate({ _id }, { $set: updateUserDto })
  }

  async updateEmailVerificationStatus(_id: string): Promise<void> {
    await this.findOne(_id)

    await this.userModel.findByIdAndUpdate(
      { _id },
      {
        $set: { verified: true },
        $unset: { emailVerificationToken: '' }
      }
    )
  }

  async updateEmailVerificationToken(_id: string, token: string, expiresIn: number): Promise<void> {
    const user = await this.findOne(_id)

    await this.userModel.findByIdAndUpdate(
      { _id },
      { $set: { emailVerificationToken: { token, expiresIn } } }
    )

    this.mailerService.sendVerificationEmail(user)
  }

  async delete(_id: string): Promise<void> {
    await this.findOne(_id)
    await this.userModel.deleteOne({ _id })
  }
}
