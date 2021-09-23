import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import slugify from 'slugify';

@Injectable()
@ValidatorConstraint({ name: 'slugify', async: true })
export class Slugify implements ValidatorConstraintInterface {
  public async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
    validationArguments.object['slug'] = slugify(value, { lower: true, locale: 'en' });
    return true;
  }
}
