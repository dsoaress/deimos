import { Ticket } from 'src/ticket/ticket.entity'
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

import { User } from '../user/user.entity'

@Entity('ticket_message')
export class TicketMessage {
  @PrimaryColumn()
  id!: string

  @ManyToOne(() => Ticket, { onDelete: 'CASCADE' })
  ticket!: Ticket

  @ManyToOne(() => User, { eager: true })
  user!: User

  @Column({ type: 'text' })
  message!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @BeforeInsert()
  generateUuid() {
    this.id = uuid()
  }
}
