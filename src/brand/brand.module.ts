import { Module } from '@nestjs/common'

import { BrandController } from './brand.controller'
import { BrandService } from './brand.service'

@Module({
  providers: [BrandService],
  controllers: [BrandController]
})
export class BrandModule {}
