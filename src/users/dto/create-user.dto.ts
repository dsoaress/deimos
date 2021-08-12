import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'

import { Roles } from '../schema/user.schema'
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string

  @IsNotEmpty()
  @IsString()
  lastName!: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsNotEmpty()
  @IsEmail()
  email!: string

  @MinLength(8)
  @IsString()
  password!: string

  @IsOptional()
  @IsBoolean()
  verified!: boolean

  @IsOptional()
  emailVerificationToken!: {
    token: string
    expiresIn: number
  }

  @IsOptional()
  @IsEnum(Roles)
  role?: Roles
}
