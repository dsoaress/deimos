import { IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator'

import { Org } from '../../org/org.entity'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  oldPassword?: string

  @IsOptional()
  @MinLength(8)
  password?: string

  @IsOptional()
  @IsUUID()
  lastOrgViewed?: Org
}
