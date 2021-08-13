import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { User } from '../user/user.entity'

@Entity('file')
export class File {
  @PrimaryColumn()
  id!: string

  @Column()
  filename!: string

  @Column()
  filenameUrl!: string

  @Column()
  type!: string

  @Column()
  size!: number

  @ManyToOne(() => User)
  createdBy!: User

  @CreateDateColumn()
  createdAt!: Date

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}
