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
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { TokenExistsDto } from './dto/token-exists.dto copy'
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
        throw new BadRequestException('Token expired')
      }

      await this.tokenService.delete(tokenExists.token)
      await this.userService.setEmailVerificationStatus(userId)
    }

    user.verified = true
    const session = await this.signIn(user)

    return session
  }

  async resendVerificationEmail(resendVerificationEmailDto: ResendVerificationEmailDto) {
    const user = await this.userService.findOneByEmail(resendVerificationEmailDto.email)
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

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      template: `${process.cwd()}/templates/reset-password`,
      context: {
        firstName: user.firstName,
        link: `${process.env.APP_URL}/auth/reset-password?token=${token}`
      }
    })
  }

  async tokenExists(tokenExistsDto: TokenExistsDto) {
    const token = await this.tokenService.findOne(tokenExistsDto.token)
    const isTokenExpired = dayjs().isAfter(dayjs.unix(token.expiresIn))

    if (isTokenExpired) {
      throw new BadRequestException('Token expired')
    }
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    const tokenExists = await this.tokenService.findOne(token)

    if (tokenExists.token !== token) {
      throw new BadRequestException('Token invalid')
    }

    await this.tokenService.delete(tokenExists.token)
    await this.userService.resetPassword(tokenExists.user.id, password)

    return await this.signIn(tokenExists.user)
  }
}
