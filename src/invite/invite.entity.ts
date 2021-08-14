import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Org } from '../org/org.entity'

@Entity('invite')
export class Invite {
  @PrimaryColumn()
  id!: string

  @Column()
  email!: string

  @ManyToOne(() => Org, org => org.invites, { onDelete: 'CASCADE' })
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
