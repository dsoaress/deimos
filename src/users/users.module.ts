import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MailerModule } from '../mailer/mailer.module'
import { UserSchema } from './schema/user.schema'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), MailerModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
