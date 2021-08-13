import dayjs from 'dayjs'
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
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

  constructor() {
    if (!this.token) {
      this.token = uuid()
    }

    if (!this.expiresIn) {
      this.expiresIn = dayjs().add(30, 'days').unix()
    }
  }
}
