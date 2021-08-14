import { hashSync } from 'bcryptjs'
import { Exclude } from 'class-transformer'
import {
  AfterUpdate,
  BeforeInsert,
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
import { Org } from '../org/org.entity'

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

  @OneToOne(() => Org, { onDelete: 'SET NULL' })
  @JoinColumn()
  lastOrgViewed?: Org

  @ManyToMany(() => Org, org => org.users, { onDelete: 'SET NULL' })
  orgs?: Org[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @BeforeInsert()
  generateUuid() {
    this.id = uuid()
  }

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 8)
  }
}
