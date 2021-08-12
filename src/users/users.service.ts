import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { compare, hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import { v4 as uuid } from 'uuid'

import { MailProvider } from '../common/providers/mail.provider'
import { forgotPassword } from './../common/templates/forgot-password.template'
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

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto

    const emailExists = await this.userModel.findOne({ email })

    if (emailExists) {
      throw new BadRequestException('Email already registered')
    }

    const { token, expiresIn } = this.generateEmailVerificationToken()

    createUserDto.password = await hash(password, 8)
    createUserDto.emailVerificationToken = { token, expiresIn }

    const createdUser = new this.userModel(createUserDto)

    const user = await createdUser.save()

    this.checkEmail(user)

    return user
  }

  checkEmail(user: User): void {
    const message = {
      to: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      },
      subject: 'Check your email',
      templateData: {
        template: forgotPassword,
        variables: {
          firstName: user.firstName,
          link: `http://localhost:3010/session/${user._id}/${user.emailVerificationToken.token}`,
          token: user.emailVerificationToken.token
        }
      }
    }

    MailProvider.sendMail(message)
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

  async verifyEmail(_id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      { _id },
      {
        $set: { verified: true },
        $unset: { emailVerificationToken: '' }
      }
    )
  }

  generateEmailVerificationToken(): { token: string; expiresIn: number } {
    return {
      token: uuid(),
      expiresIn: dayjs().add(30, 'days').unix()
    }
  }

  async updateEmailVerificationToken(_id: string, token: string, expiresIn: number): Promise<void> {
    const user = await this.userModel.findByIdAndUpdate(
      { _id },
      { $set: { emailVerificationToken: { token, expiresIn } } }
    )

    if (!user) {
      throw new NotFoundException('User not found')
    }

    this.checkEmail(user)
  }

  async delete(_id: string): Promise<void> {
    const user = await this.userModel.findOne({ _id })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    await this.userModel.deleteOne({ _id })
  }
}
