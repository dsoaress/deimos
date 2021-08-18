import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe
} from '@nestjs/common'
import { UsePipes } from '@nestjs/common'

import { Public } from '../common/decorators/public-route.decorator'
import { Role } from '../common/enums/role.enum'
import { LocalAuthGuard } from '../common/guards/local-auth.guard'
import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { User } from '../user/user.entity'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ResendVerificationEmailDto } from './dto/resend-verification-email.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { TokenExistsDto } from './dto/token-exists.dto copy'
import { SessionService } from './session.service'

export type UserRequest = {
  id: string
  role: Role
}

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post()
  async signIn(@Req() { user }: { user: User }) {
    return this.sessionService.signIn(user)
  }

  @Public()
  @Get(':userId/:token')
  async verifyEmail(
    @Param('userId', ParametersPipe) userId: string,
    @Param('token', ParametersPipe) token: string
  ) {
    return await this.sessionService.verifyEmail(userId, token)
  }

  @Public()
  @HttpCode(200)
  @Post('resend-verification-email')
  @UsePipes(ValidationPipe)
  async resendVerificationEmail(@Body() resendVerificationEmailDto: ResendVerificationEmailDto) {
    await this.sessionService.resendVerificationEmail(resendVerificationEmailDto)
  }

  @Public()
  @HttpCode(200)
  @Post('token-exists')
  @UsePipes(ValidationPipe)
  async tokenExists(@Body() tokenExistsDto: TokenExistsDto) {
    await this.sessionService.tokenExists(tokenExistsDto)
  }

  @Public()
  @HttpCode(200)
  @Post('refresh-token')
  @UsePipes(ValidationPipe)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.sessionService.refreshToken(refreshTokenDto)
  }

  @Public()
  @HttpCode(200)
  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  async sendForgotPasswordEmail(@Body() forgotPassword: ForgotPasswordDto) {
    await this.sessionService.sendForgotPasswordEmail(forgotPassword)
  }

  @Public()
  @HttpCode(200)
  @Post('reset-password')
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.sessionService.resetPassword(resetPasswordDto)
  }
}
