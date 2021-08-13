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

  async create(teamId: string): Promise<void> {
    const subscription = this.subscriptionService.create({
      team: { id: teamId }
    })

    await this.subscriptionService.save(subscription)
  }
}
