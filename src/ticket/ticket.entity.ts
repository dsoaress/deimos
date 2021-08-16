import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { TicketMessage } from '../ticket-message/ticket-message.entity'
import { User } from '../user/user.entity'

@Entity('ticket')
export class Ticket {
  @PrimaryColumn()
  id!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  client!: User

  @ManyToOne(() => User, { onDelete: 'SET NULL', eager: true })
  agent!: User

  @Column()
  area!: string

  @Column()
  subject!: string

  @OneToMany(() => TicketMessage, ticketMessage => ticketMessage.ticket, { cascade: true })
  ticketMessages!: TicketMessage[]

  @Column({ default: true })
  isOpen!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @BeforeInsert()
  generateUuid() {
    this.id = uuid()
  }
}
