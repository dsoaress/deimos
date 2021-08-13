import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RequestController } from './request.controller'
import { Request } from './request.entity'
import { RequestService } from './request.service'

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  providers: [RequestService],
  controllers: [RequestController]
})
export class RequestModule {}
