import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors
} from '@nestjs/common'
import { Request } from 'express'

import { Public } from '../common/decorators/public-route.decorator'
import { ParametersPipe } from '../common/pipes/parameters.pipe'
import { SubscriptionService } from './subscription.service'

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.subscriptionService.findAll()
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParametersPipe) id: string) {
    return await this.subscriptionService.findOne(id)
  }

  @Post()
  async create(@Body() { orgId }: { orgId: string }) {
    const url = await this.subscriptionService.create(orgId)
    return {
      url,
      statusCode: 302
    }
  }

  @Public()
  @Post('webhooks')
  async webhooks(@Req() request: Request) {
    await this.subscriptionService.webhooks(request)
  }
}
