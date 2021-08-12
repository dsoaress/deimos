import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token!: string

  @IsNotEmpty()
  @IsEmail()
  email!: string

  @MinLength(8)
  @IsString()
  password!: string
}
