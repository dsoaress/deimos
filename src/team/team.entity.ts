import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { User } from '../user/user.entity'

@Entity('team')
export class Team {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User)
  @JoinColumn()
  accountManager?: User

  @ManyToMany(() => User, user => user.teams)
  @JoinTable()
  users?: User[]

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
