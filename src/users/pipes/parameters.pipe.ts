import { BadRequestException, PipeTransform } from '@nestjs/common'
import { isValidObjectId } from 'mongoose'

export class ParametersPipe implements PipeTransform {
  transform(value: string) {
    const isValidId = isValidObjectId(value)

    if (!isValidId) {
      throw new BadRequestException('This is not a valid id')
    }

    return value
  }
}
