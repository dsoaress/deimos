import { IsOptional, IsString } from 'class-validator'

import { User } from '../../user/user.entity'

export class UpdateOrgDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  accountManager?: User
}
