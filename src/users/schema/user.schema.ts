import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type UserDocument = User & mongoose.Document

export enum Roles {
  client = 'client',
  designer = 'designer',
  account_manager = 'account_manager',
  supervisor = 'supervisor',
  admin = 'admin'
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id!: mongoose.ObjectId

  @Prop()
  firstName!: string

  @Prop()
  lastName!: string

  @Prop()
  avatar?: string

  @Prop({ unique: true })
  email!: string

  @Prop()
  password!: string

  @Prop({ default: false })
  verified!: boolean

  @Prop({ type: { token: String, expiresIn: Number } })
  emailVerificationToken!: {
    token: string
    expiresIn: number
  }

  @Prop({ default: Roles.client, enum: Roles })
  role!: Roles
}

export const UserSchema = SchemaFactory.createForClass(User)
