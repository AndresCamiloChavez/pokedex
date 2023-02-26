import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  // Los pipes transforman la data
  transform(value: string, metadata: ArgumentMetadata) {
    console.log({ value, metadata });
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} not is a valid MongoId`);
    }
    return value;
  }
}
