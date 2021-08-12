import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { User } from '../../users/schema/user.schema'

export type SessionDocument = Session & mongoose.Document

@Schema()
export class Session {
  @Prop({ unique: true })
  refreshToken!: string

  @Prop()
  expiresIn!: number

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user!: User
}

export const SessionSchema = SchemaFactory.createForClass(Session)
