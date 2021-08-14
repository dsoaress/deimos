import dayjs from 'dayjs'
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { User } from '../user/user.entity'

@Entity('token')
export class Token {
  @PrimaryColumn()
  token!: string

  @Column()
  expiresIn!: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User

  @BeforeInsert()
  generateUuid() {
    this.token = uuid()
  }

  @BeforeInsert()
  generateExpiresIn() {
    this.expiresIn = dayjs().add(30, 'days').unix()
  }
}
