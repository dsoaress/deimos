import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  subject!: string

  @IsString()
  @IsNotEmpty()
  area!: string

  @IsString()
  @IsNotEmpty()
  message!: string
}
