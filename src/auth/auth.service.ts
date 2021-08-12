import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { compare } from 'bcryptjs'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'

import { MailerService } from '../mailer/mailer.service'
import { SessionService } from '../session/session.service'
import { UsersService } from '../users/users.service'
import { SignInDto } from './dto/sign-in.dto'

type SessionResponse = {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailerService: MailerService
  ) {}

  async signIn({ email, password }: SignInDto): Promise<SessionResponse> {
    const user = await this.usersService.findOneByEmail(email)

    if (!user.verified) {
      const emailVerificationTokenExpired = dayjs().isAfter(
        dayjs.unix(user.emailVerificationToken.expiresIn)
      )

      if (emailVerificationTokenExpired) {
        const { token, expiresIn } = this.generateEmailVerificationToken()
        user.emailVerificationToken = { token, expiresIn }

        await this.usersService.updateEmailVerificationToken(user._id.toString(), token, expiresIn)
      } else {
        this.mailerService.sendVerificationEmail(user)
      }

      throw new ForbiddenException('Not verified email')
    }

    const checkPasswords = await compare(password, user.password)

    if (!checkPasswords) {
      throw new BadRequestException()
    }

    const { accessToken, refreshToken } = await this.sessionService.create(user)

    return { accessToken, refreshToken }
  }

  async verifyEmail(_id: string, token: string): Promise<void> {
    const user = await this.usersService.findOne(_id)

    if (!user.verified) {
      const emailVerificationTokenExpired = dayjs().isAfter(
        dayjs.unix(user.emailVerificationToken.expiresIn)
      )

      if (emailVerificationTokenExpired) {
        const { token, expiresIn } = this.generateEmailVerificationToken()
        user.emailVerificationToken = { token, expiresIn }

        await this.usersService.updateEmailVerificationToken(_id, token, expiresIn)

        throw new BadRequestException('Token expired')
      }

      if (token !== user.emailVerificationToken.token) {
        throw new BadRequestException('Token invalid')
      }

      await this.usersService.updateEmailVerificationStatus(_id)
    }
  }

  generateEmailVerificationToken(): { token: string; expiresIn: number } {
    return {
      token: uuid(),
      expiresIn: dayjs().add(30, 'days').unix()
    }
  }
}
