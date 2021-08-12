import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ParametersPipe } from 'src/common/pipes/parameters.pipe'

import { AuthService } from './auth.service'
import { SignInDto } from './dto/sign-in.dto'

type SessionResponse = {
  accessToken: string
  refreshToken: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async signIn(@Body() signInDto: SignInDto): Promise<SessionResponse> {
    return await this.authService.signIn(signInDto)
  }

  @Get(':_id/:token')
  async verifyEmail(
    @Param('_id', ParametersPipe) _id: string,
    @Param('token') token: string
  ): Promise<void> {
    await this.authService.verifyEmail(_id, token)
  }
}
