import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator'

import { Roles } from '../user.entity'

export class UpdateUserDto {
  @IsOptional()
  firstName?: string

  @IsOptional()
  lastName?: string

  @IsOptional()
  avatar?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  oldPassword?: string

  @IsOptional()
  @MinLength(8)
  password?: string

  @IsOptional()
  @IsEnum(Roles)
  role?: Roles
}
