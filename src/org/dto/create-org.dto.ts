import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrgDto {
  @IsNotEmpty()
  @IsString()
  name!: string
}
