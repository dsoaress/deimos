import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MailerService } from '@nestjs-modules/mailer'
import { compare, hash } from 'bcryptjs'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { FileService } from '../file/file.service'
import { TokenService } from '../token/token.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userService: Repository<User>,
    private fileService: FileService,
    private mailerService: MailerService,
    private tokenService: TokenService
  ) {}

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.userService.createQueryBuilder('user').leftJoinAndSelect('user.avatar', 'avatar'),
      {
        sortableColumns: ['id', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
        searchableColumns: ['email', 'fullName'],
        defaultSortBy: [['firstName', 'ASC']]
      }
    )
  }

  async findOne(id: string) {
    const user = await this.userService.findOne(id, {
      relations: ['notifications', 'orgs', 'lastOrgViewed']
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findOneByEmail(email: string) {
    const user = await this.userService.findOne({ email })

    if (!user) {
      throw new BadRequestException()
    }

    return user
  }

  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.userService.findOne({
      email: createUserDto.email
    })

    if (emailExists) {
      throw new BadRequestException('Email already registered')
    }

    createUserDto.password = await hash(createUserDto.password, 8)

    const user = this.userService.create(createUserDto)

    await this.userService.save(user)
    const { token } = await this.tokenService.create(user.id)

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your sign up!',
      template: `${process.cwd()}/templates/sign-up`,
      context: {
        firstName: user.firstName,
        link: `${process.env.APP_URL}/auth/verifying-account?user=${user.id}&token=${token}`
      }
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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

      updateUserDto.password = await hash(password, 8)

      delete updateUserDto.oldPassword
    }

    await this.userService.update(id, updateUserDto)
  }

  async updateAvatar(id: string, file: Express.Multer.File) {
    const user = await this.findOne(id)
    const oldAvatar = user?.avatar?.id

    if (!file) {
      throw new BadRequestException('File is required')
    }

    const avatar = await this.fileService.create(file, id)
    await this.userService.update(id, { avatar })

    if (oldAvatar) {
      await this.fileService.delete(oldAvatar)
    }
  }

  async setEmailVerificationStatus(id: string) {
    await this.userService.update(id, { verified: true })
  }

  async resetPassword(id: string, password: string) {
    await this.findOne(id)

    const hashedPassword = await hash(password, 8)

    await this.userService.update(id, { password: hashedPassword })
  }

  async delete(id: string) {
    await this.findOne(id)
    await this.userService.delete(id)
  }
}
