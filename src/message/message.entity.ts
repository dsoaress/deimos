import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Request } from '../request/request.entity'
import { User } from '../user/user.entity'

@Entity('message')
export class Message {
  @PrimaryColumn()
  id!: string

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user!: User

  @Column({ type: 'text' })
  message!: string

  @ManyToOne(() => Request, { onDelete: 'CASCADE' })
  request!: Request

  @CreateDateColumn()
  createdAt!: Date

  @BeforeInsert()
  generateUuid() {
    this.id = uuid()
  }
}
