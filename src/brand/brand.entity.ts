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

@Entity('brand')
export class Brand {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => Team, team => team.brands, { onDelete: 'CASCADE' })
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
