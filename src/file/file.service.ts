import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import aws, { S3 } from 'aws-sdk'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { File } from './file.entity'

@Injectable()
export class FileService {
  private client: S3

  constructor(
    @InjectRepository(File)
    private fileService: Repository<File>
  ) {
    this.client = new aws.S3({
      region: process.env.AWS_REGION
    })
  }

  async findAll(): Promise<File[]> {
    return await this.fileService.find({ relations: ['createdBy'] })
  }

  async findOne(id: string): Promise<File> {
    const file = await this.fileService.findOne(id, { relations: ['createdBy'] })

    if (!file) {
      throw new NotFoundException('File not found')
    }

    return file
  }

  async create(file: Express.Multer.File, userId: string): Promise<File> {
    const filename = uuid() + file.originalname

    if (!file) {
      throw new BadRequestException('File is required')
    }

    await this.client
      .putObject({
        Bucket: 'mars-dev',
        Key: filename,
        ACL: 'public-read',
        Body: file.buffer,
        ContentType: file.mimetype
      })
      .promise()

    const createdFile = this.fileService.create({
      filename: filename,
      filenameUrl: `${process.env.AWS_S3_BUCKET_URL}/${filename}`,
      type: file.mimetype,
      size: file.size,
      createdBy: { id: userId }
    })

    await this.fileService.save(createdFile)

    return createdFile
  }

  async delete(id: string): Promise<void> {
    const file = await this.findOne(id)
    await this.fileService.delete(id)

    await this.client
      .deleteObject({
        Bucket: 'mars-dev',
        Key: file.filename
      })
      .promise()
  }
}
