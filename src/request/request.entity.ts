import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Team } from '../team/team.entity'
import { User } from '../user/user.entity'

@Entity('request')
export class Request {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  designer?: User

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn()
  team!: Team

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
