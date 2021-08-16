import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsUUID()
  token!: string

  @MinLength(8)
  @IsString()
  password!: string
}
