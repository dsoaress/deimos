import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { compare } from 'bcryptjs'
import dayjs from 'dayjs'
import { Repository } from 'typeorm'

import { MailerService } from '../mailer/mailer.service'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { TokenService } from './../token/token.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { Session } from './session.entity'

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionService: Repository<Session>,
    private userService: UserService,
    private tokenService: TokenService,
    private mailerService: MailerService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email)
    const checkPasswords = await compare(password, user.password)

    if (!checkPasswords) {
      throw new BadRequestException()
    }

    return user
  }

  async signIn(user: User) {
    if (!user.verified) {
      const { token } = await this.tokenService.create(user.id)
      this.mailerService.sendVerificationEmail(user, token)

      throw new ForbiddenException('Not verified email')
    }

    const session = this.sessionService.create({
      user: { id: user.id }
    })

    const { refreshToken } = await this.sessionService.save(session)

    const payload = { role: user.role, sub: user.id }
    const accessToken = this.jwtService.sign(payload)

    return { accessToken, refreshToken }
  }

  async verifyEmail(userId: string, token: string) {
    const user = await this.userService.findOne(userId)

    if (!user.verified) {
      const tokenExists = await this.tokenService.findOne(token)

      if (tokenExists.user.id !== userId) {
        throw new BadRequestException('Token invalid')
      }

      const emailVerificationTokenExpired = dayjs().isAfter(dayjs.unix(tokenExists.expiresIn))

      if (emailVerificationTokenExpired) {
        await this.tokenService.delete(tokenExists.token)
        const data = await this.tokenService.create(user.id)
        this.mailerService.sendVerificationEmail(user, data.token)

        throw new BadRequestException('Token expired')
      }

      await this.tokenService.delete(tokenExists.token)
      await this.userService.setEmailVerificationStatus(userId)
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const refreshTokenExists = await this.sessionService.findOne(refreshTokenDto, {
      relations: ['user']
    })

    if (!refreshTokenExists) {
      throw new NotFoundException('Refresh token not found')
    }

    const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshTokenExists.expiresIn))

    if (refreshTokenExpired) {
      await this.sessionService.delete(refreshTokenDto)
      throw new BadRequestException('Refresh token expired')
    }

    await this.sessionService.delete(refreshTokenDto)

    const { accessToken, refreshToken } = await this.signIn(refreshTokenExists.user)

    return { accessToken, refreshToken }
  }

  async sendForgotPasswordEmail({ email }: ForgotPasswordDto) {
    const user = await this.userService.findOneByEmail(email)
    const { token } = await this.tokenService.create(user.id)

    this.mailerService.sendForgotPasswordEmail(user, token)
  }

  async resetPassword({ email, token, password }: ResetPasswordDto) {
    const user = await this.userService.findOneByEmail(email)
    const tokenExists = await this.tokenService.findOne(user.id)

    if (tokenExists.token === token) {
      const forgotPasswordTokenExpired = dayjs().isAfter(dayjs.unix(tokenExists.expiresIn))

      if (forgotPasswordTokenExpired) {
        throw new BadRequestException('Token expired')
      }

      await this.userService.resetPassword(user.id, password)
    } else {
      throw new BadRequestException('Token invalid')
    }
  }
}
