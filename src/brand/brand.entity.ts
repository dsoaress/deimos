import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { Org } from '../org/org.entity'

@Entity('brand')
export class Brand {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => Org, org => org.brands, { onDelete: 'CASCADE' })
  org!: Org

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @BeforeInsert()
  generateUuid() {
    this.id = uuid()
  }
}
