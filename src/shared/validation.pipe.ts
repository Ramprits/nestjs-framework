import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        `validation failed no body submitted`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${this.formateError(errors)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  // tslint:disable-next-line: ban-types
  private toValidate(metatype: Function): boolean {
    // tslint:disable-next-line: ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formateError(errors: any[]) {
    return errors
      .map(err => {
        for (const property of err.constraints) {
          return err.constraints[property];
        }
      })
      .join(',');
  }

  private isEmpty(value: any) {
    if (Object.keys.length > 0) {
      return false;
    }
    return true;
  }
}
