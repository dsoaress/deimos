import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { User } from '../user/user.entity'

@Entity('notification')
export class Notification {
  @PrimaryColumn()
  id!: string

  @Column()
  title!: string

  @Column({ type: 'text' })
  description!: string

  @Column()
  url!: string

  @Column({ default: false })
  read!: boolean

  @ManyToOne(() => User, user => user.notifications, { onDelete: 'CASCADE' })
  user!: User

  @CreateDateColumn()
  createdAt!: Date

  @BeforeInsert()
  generateUuid() {
    this.id = uuid()
  }
}
