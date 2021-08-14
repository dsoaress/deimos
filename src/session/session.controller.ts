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

import { Public } from '../common/decorators/public-route.decorator'
import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { Roles, User } from '../user/user.entity'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { SessionService } from './session.service'

type SessionResponse = {
  accessToken: string
  refreshToken: string
}

export type UserRequest = {
  userId: string
  role: Roles
}

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post()
  async signIn(@Request() { user }: { user: User }) {
    return this.sessionService.signIn(user)
  }

  @Public()
  @Get(':userId/:token')
  async verifyEmail(
    @Param('userId', ParametersPipe) userId: string,
    @Param('token', ParametersPipe) token: string
  ): Promise<void> {
    await this.sessionService.verifyEmail(userId, token)
  }

  @Public()
  @HttpCode(200)
  @Post('refresh-token')
  @UsePipes(ValidationPipe)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<SessionResponse> {
    return await this.sessionService.refreshToken(refreshTokenDto)
  }

  @Public()
  @HttpCode(200)
  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  async sendForgotPasswordEmail(@Body() forgotPassword: ForgotPasswordDto): Promise<void> {
    await this.sessionService.sendForgotPasswordEmail(forgotPassword)
  }

  @Public()
  @HttpCode(200)
  @Post('reset-password')
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.sessionService.resetPassword(resetPasswordDto)
  }
}
