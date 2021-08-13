import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Team } from '../team/team.entity'

export enum Roles {
  client = 'client',
  designer = 'designer',
  account_manager = 'account_manager',
  supervisor = 'supervisor',
  admin = 'admin'
}

@Entity('user')
export class User {
  @PrimaryColumn()
  id!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ unique: true })
  email!: string

  @Exclude()
  @Column()
  password!: string

  @Column({ default: false })
  verified!: boolean

  @Column({ type: 'enum', enum: Roles, default: Roles.client })
  role!: Roles

  @OneToOne(() => Team)
  @JoinColumn()
  lastTeamViewed?: Team

  @ManyToMany(() => Team, team => team.users)
  teams?: Team[]

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
