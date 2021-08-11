import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { compare } from 'bcryptjs'
import dayjs from 'dayjs'
import { sign } from 'jsonwebtoken'
import { Model } from 'mongoose'
import { User } from 'src/users/schema/user.schema'
import { v4 as uuid } from 'uuid'

import { UsersService } from '../users/users.service'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SignInDto } from './dto/sign-in.dto'
import { SessionDocument } from './schema/session.schema'

export type Response = {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session') private sessionModel: Model<SessionDocument>,
    private usersService: UsersService
  ) {}

  async signIn({ email, password }: SignInDto): Promise<Response> {
    const user = await this.usersService.findOneByEmail(email)

    if (!user) {
      throw new UnauthorizedException()
    }

    const checkPasswords = await compare(password, user.password)

    if (!checkPasswords) {
      throw new UnauthorizedException()
    }

    const { accessToken, refreshToken } = await this.generateTokens(user)

    return { accessToken, refreshToken }
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

    const { accessToken, refreshToken } = await this.generateTokens(refreshTokenExists.user)

    return { accessToken, refreshToken }
  }

  private async generateTokens(user: User): Promise<Response> {
    const createdSession = new this.sessionModel({
      refreshToken: uuid(),
      expiresIn: dayjs().add(30, 'days').unix(),
      user
    })

    const { refreshToken } = await createdSession.save()

    const accessToken = sign({ role: user.role }, '123456', {
      subject: user._id.toString(),
      expiresIn: '15m'
    })

    return { accessToken, refreshToken }
  }
}
