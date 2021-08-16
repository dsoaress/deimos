import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { UserRequest } from '../session/session.controller'
import { FileService } from './file.service'

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.fileService.findAll()
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParametersPipe) id: string) {
    return await this.fileService.findOne(id)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Request() { user }: { user: UserRequest }
  ) {
    return await this.fileService.create(file, user.id)
  }

  @Delete(':id')
  async delete(@Param('id', ParametersPipe) id: string) {
    await this.fileService.delete(id)
  }
}
