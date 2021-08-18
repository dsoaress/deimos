import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResendVerificationEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string
}
