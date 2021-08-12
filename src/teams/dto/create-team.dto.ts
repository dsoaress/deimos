import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { User } from 'src/users/schema/user.schema'

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsOptional()
  @IsArray()
  users!: User[]
}
