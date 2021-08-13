import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { User } from '../../user/user.entity'

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsOptional()
  @IsArray()
  users?: User[]
}
