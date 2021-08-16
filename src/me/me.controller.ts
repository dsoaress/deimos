import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { UserRequest } from '../session/session.controller'
import { UpdateUserDto } from '../user/dto/update-user.dto'
import { UserService } from '../user/user.service'

@Controller('me')
export class MeController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findMe(@Req() { user }: { user: UserRequest }) {
    return await this.userService.findOne(user.id)
  }

  @Patch()
  @UsePipes(ValidationPipe)
  async update(@Req() { user }: { user: UserRequest }, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(user.id, updateUserDto)
  }

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Req() { user }: { user: UserRequest },
    @UploadedFile() file: Express.Multer.File
  ) {
    await this.userService.updateAvatar(user.id, file)
  }

  @Delete()
  async delete(@Req() { user }: { user: UserRequest }) {
    await this.userService.delete(user.id)
  }
}
