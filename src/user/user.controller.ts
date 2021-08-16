import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { Public } from '../common/decorators/public-route.decorator'
import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { UserRequest } from '../session/session.controller'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.userService.findAll()
  }

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async findMe(@Request() { user }: { user: UserRequest }) {
    return await this.userService.findOne(user.userId)
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParametersPipe) id: string) {
    return await this.userService.findOne(id)
  }

  @Public()
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto)
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(@Param('id', ParametersPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(id, updateUserDto)
  }

  @Patch('avatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParametersPipe) id: string
  ) {
    await this.userService.updateAvatar(file, id)
  }

  @Delete(':id')
  async delete(@Param('id', ParametersPipe) id: string) {
    await this.userService.delete(id)
  }
}
