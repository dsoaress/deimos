import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common'
import { UsePipes } from '@nestjs/common'

import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SessionService } from './session.service'

type SessionResponse = {
  accessToken: string
  refreshToken: string
}
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @HttpCode(200)
  @Post('refresh-token')
  @UsePipes(ValidationPipe)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<SessionResponse> {
    return await this.sessionService.refreshToken(refreshTokenDto)
  }
}
