import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Org } from '../org/org.entity'

@Entity('subscription')
export class Subscription {
  @PrimaryColumn()
  id!: string

  @Column()
  stripeCustomerId!: string

  @Column({ nullable: true })
  stripeSubscriptionId?: string

  @Column({ nullable: true })
  status?: string

  @OneToOne(() => Org, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  org!: Org

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @BeforeInsert()
  generateUuid() {
    this.id = uuid()
  }
}
