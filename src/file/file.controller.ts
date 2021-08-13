import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ParametersPipe } from 'src/common/pipes/parameters.pipe'
import { JwtAuthGuard } from 'src/session/guards/jwt-auth.guard'
import { UserRequest } from 'src/session/session.controller'

import { File } from './file.entity'
import { FileService } from './file.service'

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(): Promise<File[]> {
    return await this.fileService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParametersPipe) id: string): Promise<File> {
    return await this.fileService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Request() { user }: { user: UserRequest }
  ): Promise<File> {
    return await this.fileService.create(file, user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParametersPipe) id: string): Promise<void> {
    await this.fileService.delete(id)
  }
}
