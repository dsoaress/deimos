import { Exclude, Expose } from 'class-transformer'
import {
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

import { Role } from '../common/enums/role.enum'
import { File } from '../file/file.entity'
import { Notification } from '../notification/notification.entity'
import { Org } from '../org/org.entity'

@Entity('user')
export class User {
  @PrimaryColumn()
  id!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @Exclude()
  @ManyToOne(() => File, { eager: true })
  @JoinColumn()
  avatar?: File

  @Expose()
  get avatarUrl() {
    if (this.avatar) {
      return this.avatar.filenameUrl
    }
    return null
  }

  @Column({ unique: true })
  email!: string

  @Exclude()
  @Column()
  password!: string

  @Column({ default: false })
  verified!: boolean

  @Column({ type: 'enum', enum: Role, default: Role.client })
  role!: Role

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
}
