import {
  BeforeInsert,
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

@Entity('org')
export class Org {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User)
  accountManager?: User

  @OneToOne(() => Subscription, subscription => subscription.org, { cascade: true })
  @JoinColumn()
  subscription!: Subscription

  @ManyToMany(() => User, user => user.orgs, { onDelete: 'SET NULL' })
  @JoinTable()
  users?: User[]

  @OneToMany(() => Brand, brand => brand.org)
  brands?: Brand[]

  @OneToMany(() => Invite, invite => invite.org)
  invites?: Invite[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @BeforeInsert()
  generateUuid() {
    this.id = uuid()
  }
}
