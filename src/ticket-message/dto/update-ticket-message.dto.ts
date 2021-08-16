import { IsOptional, IsString } from 'class-validator'

export class UpdateTicketMessageDto {
  @IsOptional()
  @IsString()
  message?: string
}
