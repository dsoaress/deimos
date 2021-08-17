import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string

  @IsNotEmpty()
  @IsString()
  lastName!: string

  @IsNotEmpty()
  @IsEmail()
  email!: string

  @MinLength(8)
  @IsString()
  password!: string
}
