import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator'

import { User } from '../../user/user.entity'

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  subject?: string

  @IsOptional()
  @IsString()
  area?: string

  @IsOptional()
  @IsUUID()
  agent?: User

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean
}
