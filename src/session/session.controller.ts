import { Body, Controller, Get, HttpCode, Param, Post, ValidationPipe } from '@nestjs/common'
import { UsePipes } from '@nestjs/common'
import { ParametersPipe } from 'src/common/pipes/parameters.pipe'

import { RefreshTokenDto } from './dto/refresh-token.dto'
import { SignInDto } from './dto/sign-in.dto'
import { Response, SessionService } from './session.service'

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @HttpCode(200)
  @Post('sign-in')
  @UsePipes(ValidationPipe)
  async signIn(@Body() signInDto: SignInDto): Promise<Response> {
    return await this.sessionService.signIn(signInDto)
  }

  @HttpCode(200)
  @Post('refresh-token')
  @UsePipes(ValidationPipe)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<Response> {
    return await this.sessionService.refreshToken(refreshTokenDto)
  }

  @Get(':_id/:token')
  async verifyEmail(
    @Param('_id', ParametersPipe) _id: string,
    @Param('token') token: string
  ): Promise<void> {
    return await this.sessionService.verifyEmail(_id, token)
  }
}
