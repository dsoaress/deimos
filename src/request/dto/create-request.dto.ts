import { IsNotEmpty, IsString } from 'class-validator'

import { Team } from '../../team/team.entity'

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsString()
  team!: Team
}
