import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Team } from '../team/team.entity'

@Entity('invite')
export class Invite {
  @PrimaryColumn()
  id!: string

  @Column()
  email!: string

  @ManyToOne(() => Team, team => team.invites, { onDelete: 'CASCADE' })
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
