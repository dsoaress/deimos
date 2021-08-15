import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { OrgController } from './org.controller'
import { Org } from './org.entity'
import { OrgService } from './org.service'

@Module({
  imports: [TypeOrmModule.forFeature([Org])],
  providers: [OrgService],
  controllers: [OrgController],
  exports: [OrgService]
})
export class OrgModule {}
