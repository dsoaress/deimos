import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { File } from '../file/file.entity'
import { Notification } from '../notification/notification.entity'
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

  @ManyToOne(() => File, { eager: true })
  @JoinColumn()
  avatar?: File

  @Column({ unique: true })
  email!: string

  @Exclude()
  @Column()
  password!: string

  @Column({ default: false })
  verified!: boolean

  @Column({ type: 'enum', enum: Roles, default: Roles.client })
  role!: Roles

  @OneToMany(() => Notification, notification => notification.user)
  notifications?: Notification[]

  @OneToOne(() => Team, { onDelete: 'SET NULL' })
  @JoinColumn()
  lastTeamViewed?: Team

  @ManyToMany(() => Team, team => team.users, { onDelete: 'SET NULL' })
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
