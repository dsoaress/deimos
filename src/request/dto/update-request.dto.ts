import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { User } from '../../user/user.entity'

export class UpdateRequestDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  designer?: User
}
