import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { Paginate, PaginateQuery } from 'nestjs-paginate'

import { Public } from '../common/decorators/public-route.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { Role } from '../common/enums/role.enum'
import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.admin, Role.supervisor)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.userService.findAll(query)
  }

  @Get(':id')
  @Roles(Role.admin, Role.supervisor)
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
  @Roles(Role.admin, Role.supervisor)
  @UsePipes(ValidationPipe)
  async update(@Param('id', ParametersPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @Roles(Role.admin)
  async delete(@Param('id', ParametersPipe) id: string) {
    await this.userService.delete(id)
  }
}
