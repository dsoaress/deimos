import { BadRequestException, PipeTransform } from '@nestjs/common'
import { validate } from 'uuid'

export class ParametersPipe implements PipeTransform {
  transform(value: string) {
    const isValidId = validate(value)

    if (!isValidId) {
      throw new BadRequestException('This is not a valid id')
    }

    return value
  }
}
