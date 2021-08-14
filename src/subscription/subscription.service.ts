import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Subscription } from './subscription.entity'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionService: Repository<Subscription>
  ) {}

  async create(orgId: string): Promise<void> {
    const subscription = this.subscriptionService.create({
      org: { id: orgId }
    })

    await this.subscriptionService.save(subscription)
  }
}
