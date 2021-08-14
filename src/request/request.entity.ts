import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Message } from '../message/message.entity'
import { Org } from '../org/org.entity'
import { User } from '../user/user.entity'

@Entity('request')
export class Request {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User)
  user!: User

  @ManyToOne(() => User)
  designer?: User

  @ManyToOne(() => Org, { onDelete: 'CASCADE' })
  org!: Org

  @OneToMany(() => Message, message => message.request)
  messages?: Message[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}
