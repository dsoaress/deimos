import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { compare } from 'bcryptjs'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import { User } from 'src/users/schema/user.schema'
import { v4 as uuid } from 'uuid'

import { MailerService } from '../mailer/mailer.service'
import { UsersService } from '../users/users.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { SessionDocument } from './schema/session.schema'

type Response = {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session') private sessionModel: Model<SessionDocument>,
    private usersService: UsersService,
    private mailerService: MailerService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email)
    const checkPasswords = await compare(password, user.password)

    if (!checkPasswords) {
      throw new BadRequestException()
    }

    return user
  }

  async signIn(user: User): Promise<Response> {
    if (!user.verified) {
      const emailVerificationTokenExpired = dayjs().isAfter(
        dayjs.unix(user.emailVerificationToken.expiresIn)
      )

      if (emailVerificationTokenExpired) {
        const { token, expiresIn } = this.generateToken()
        user.emailVerificationToken = { token, expiresIn }

        await this.usersService.setEmailVerificationToken(user._id.toString(), token, expiresIn)
      } else {
        this.mailerService.sendVerificationEmail(user)
      }

      throw new ForbiddenException('Not verified email')
    }

    const createdSession = new this.sessionModel({
      refreshToken: uuid(),
      expiresIn: dayjs().add(30, 'days').unix(),
      user
    })

    const { refreshToken } = await createdSession.save()

    const payload = { role: user.role, sub: user._id.toString() }
    const accessToken = this.jwtService.sign(payload)

    return { accessToken, refreshToken }
  }

  async verifyEmail(_id: string, token: string): Promise<void> {
    const user = await this.usersService.findOne(_id)

    if (!user.verified) {
      const emailVerificationTokenExpired = dayjs().isAfter(
        dayjs.unix(user.emailVerificationToken.expiresIn)
      )

      if (emailVerificationTokenExpired) {
        const { token, expiresIn } = this.generateToken()
        user.emailVerificationToken = { token, expiresIn }

        await this.usersService.setEmailVerificationToken(_id, token, expiresIn)

        throw new BadRequestException('Token expired')
      }

      if (token !== user.emailVerificationToken.token) {
        throw new BadRequestException('Token invalid')
      }

      await this.usersService.setEmailVerificationStatus(_id)
      this.mailerService.sendVerificationEmail(user)
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<Response> {
    const refreshTokenExists = await this.sessionModel.findOne(refreshTokenDto).populate('user')

    if (!refreshTokenExists) {
      throw new NotFoundException('Refresh token not found')
    }

    const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshTokenExists.expiresIn))

    if (refreshTokenExpired) {
      await this.sessionModel.deleteOne(refreshTokenDto)
      throw new BadRequestException('Refresh token expired')
    }

    await this.sessionModel.deleteOne(refreshTokenDto)

    const { accessToken, refreshToken } = await this.signIn(refreshTokenExists.user)

    return { accessToken, refreshToken }
  }

  generateToken(): { token: string; expiresIn: number } {
    return {
      token: uuid(),
      expiresIn: dayjs().add(30, 'days').unix()
    }
  }

  async sendForgotPasswordEmail({ email }: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findOneByEmail(email)
    const { token, expiresIn } = this.generateToken()

    await this.usersService.setForgotPasswordToken(user._id.toString(), token, expiresIn)

    user.forgotPasswordToken = { token, expiresIn }

    this.mailerService.sendForgotPasswordEmail(user)
  }

  async resetPassword({ email, token, password }: ResetPasswordDto): Promise<void> {
    const user = await this.usersService.findOneByEmail(email)

    if (user.forgotPasswordToken.token === token) {
      const forgotPasswordTokenExpired = dayjs().isAfter(
        dayjs.unix(user.forgotPasswordToken.expiresIn)
      )

      if (forgotPasswordTokenExpired) {
        throw new BadRequestException('Token expired')
      }

      await this.usersService.resetPassword(user._id.toString(), password)
    } else {
      throw new BadRequestException('Token invalid')
    }
  }
}
