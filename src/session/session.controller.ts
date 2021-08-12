import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
  ValidationPipe
} from '@nestjs/common'
import { UsePipes } from '@nestjs/common'

import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { User } from '../users/schema/user.schema'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { SessionService } from './session.service'

type SessionResponse = {
  accessToken: string
  refreshToken: string
}
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async signIn(@Request() { user }: { user: User }) {
    return this.sessionService.signIn(user)
  }

  @Get(':_id/:token')
  async verifyEmail(
    @Param('_id', ParametersPipe) _id: string,
    @Param('token') token: string
  ): Promise<void> {
    await this.sessionService.verifyEmail(_id, token)
  }

  @HttpCode(200)
  @Post('refresh-token')
  @UsePipes(ValidationPipe)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<SessionResponse> {
    return await this.sessionService.refreshToken(refreshTokenDto)
  }
}
