import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { compare, hash } from 'bcryptjs'
import { Model } from 'mongoose'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './schema/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec()
    return users
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id }).exec()

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto

    const emailExists = await this.userModel.findOne({ email })

    if (emailExists) {
      throw new BadRequestException('Email already registered')
    }

    createUserDto.password = await hash(password, 8)

    const createdUser = new this.userModel(createUserDto)

    const user = await createdUser.save()

    return user
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { oldPassword, password } = updateUserDto

    const user = await this.userModel.findOne({ _id })

    if (!user) {
      throw new NotFoundException('User not found')
    }

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

  async delete(_id: string): Promise<void> {
    const user = await this.userModel.findOne({ _id })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    await this.userModel.deleteOne({ _id })
  }
}
