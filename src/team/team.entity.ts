import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Brand } from '../brand/brand.entity'
import { Invite } from '../invite/invite.entity'
import { Subscription } from '../subscription/subscription.entity'
import { User } from '../user/user.entity'

@Entity('team')
export class Team {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User)
  accountManager?: User

  @OneToOne(() => Subscription, subscription => subscription.team)
  @JoinColumn()
  subscription!: Subscription

  @ManyToMany(() => User, user => user.teams, { onDelete: 'SET NULL' })
  @JoinTable()
  users?: User[]

  @OneToMany(() => Brand, brand => brand.team)
  brands?: Brand[]

  @OneToMany(() => Invite, invite => invite.team)
  invites?: Invite[]

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
