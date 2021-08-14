import dayjs from 'dayjs'
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { User } from '../user/user.entity'

@Entity('session')
export class Session {
  @PrimaryColumn()
  refreshToken!: string

  @Column()
  expiresIn!: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User

  @BeforeInsert()
  generateUuid() {
    this.refreshToken = uuid()
  }

  @BeforeInsert()
  generateExpiresIn() {
    this.expiresIn = dayjs().add(30, 'days').unix()
  }
}
