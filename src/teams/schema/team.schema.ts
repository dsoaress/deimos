import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { User } from '../../users/schema/user.schema'

export type TeamDocument = Team & mongoose.Document

export enum Permissions {
  owner = 'owner',
  can_edit = 'can_edit',
  can_view = 'can_view'
}

@Schema({ timestamps: true })
export class Team {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id!: mongoose.ObjectId

  @Prop()
  name!: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  accountManager?: User

  @Prop({
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        permission: String
      }
    ]
  })
  users?: [
    {
      user: User
      permission: Permissions
    }
  ]
}

export const TeamSchema = SchemaFactory.createForClass(Team)
