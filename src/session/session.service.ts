import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { sign } from 'jsonwebtoken'
import { Model } from 'mongoose'
import { User } from 'src/users/schema/user.schema'
import { v4 as uuid } from 'uuid'

import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SessionDocument } from './schema/session.schema'

type Response = {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class SessionService {
  constructor(@InjectModel('Session') private sessionModel: Model<SessionDocument>) {}

  async create(user: User): Promise<Response> {
    const { JWT_SECRET } = process.env

    if (!JWT_SECRET) throw new Error('JWT_SECRET is missing')

    const createdSession = new this.sessionModel({
      refreshToken: uuid(),
      expiresIn: dayjs().add(30, 'days').unix(),
      user
    })

    const { refreshToken } = await createdSession.save()

    const accessToken = sign({ role: user.role }, JWT_SECRET, {
      subject: user._id.toString(),
      expiresIn: '15m'
    })

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

    const { accessToken, refreshToken } = await this.create(refreshTokenExists.user)

    return { accessToken, refreshToken }
  }
}
