import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'

import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './schema/user.schema'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll()
  }

  @Get(':_id')
  async findOne(@Param('_id', ParametersPipe) _id: string): Promise<User> {
    return await this.usersService.findOne(_id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto)
  }

  @Patch(':_id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('_id', ParametersPipe) _id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<void> {
    await this.usersService.update(_id, updateUserDto)
  }

  @Delete(':_id')
  async delete(@Param('_id', ParametersPipe) _id: string): Promise<void> {
    await this.usersService.delete(_id)
  }
}
