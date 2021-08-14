import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Org } from '../org/org.entity'

export enum Status {
  active = 'active',
  inactive = 'inactive'
}

export enum Plans {
  none = 'none',
  standard = 'standard',
  freelancer = 'freelancer',
  enterprise = 'enterprise'
}

@Entity('subscription')
export class Subscription {
  @PrimaryColumn()
  id!: string

  @Column({ type: 'enum', enum: Status, default: Status.inactive })
  status!: Status

  @Column({ type: 'enum', enum: Plans, default: Plans.none })
  plan!: Plans

  @OneToOne(() => Org, { onDelete: 'CASCADE' })
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
