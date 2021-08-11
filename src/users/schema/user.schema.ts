import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

export enum Roles {
  client = 'client',
  designer = 'designer',
  account_manager = 'account_manager',
  supervisor = 'supervisor',
  admin = 'admin'
}

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string

  @Prop()
  lastName: string

  @Prop()
  avatar: string

  @Prop({ unique: true })
  email: string

  @Prop()
  password: string

  @Prop({ default: Roles.client, enum: Roles })
  role: Roles
}

export const UserSchema = SchemaFactory.createForClass(User)
