import { IsNotEmpty, IsUUID } from 'class-validator'

export class TokenExistsDto {
  @IsNotEmpty()
  @IsUUID()
  token!: string
}
