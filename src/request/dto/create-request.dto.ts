import { IsNotEmpty, IsString } from 'class-validator'

import { Org } from '../../org/org.entity'

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsString()
  org!: Org
}
