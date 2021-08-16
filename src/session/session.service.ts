import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { MailerService } from '@nestjs-modules/mailer'
import { compare } from 'bcryptjs'
import dayjs from 'dayjs'
import { Repository } from 'typeorm'

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
    private mailerService: MailerService,
    private tokenService: TokenService,
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

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Verify your email',
        html: `<p>User id: ${user.id}</p> <p>Token: ${token}</p>`
      })

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

        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Verify your email',
          html: `<p>User id: ${user.id}</p> <p>Token: ${data.token}</p>`
        })

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

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      html: `<p>User id: ${user.id}</p> <p>Token: ${token}</p>`
    })
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    const tokenExists = await this.tokenService.findOne(token)

    if (tokenExists.token === token) {
      const forgotPasswordTokenExpired = dayjs().isAfter(dayjs.unix(tokenExists.expiresIn))

      if (forgotPasswordTokenExpired) {
        throw new BadRequestException('Token expired')
      }

      await this.userService.resetPassword(tokenExists.user.id, password)
    } else {
      throw new BadRequestException('Token invalid')
    }
  }
}
