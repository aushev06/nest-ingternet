import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { Inject, Injectable, Scope, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { exceptionFactory } from 'src/helpers/exceptionFactory.helper';

@Injectable({ scope: Scope.REQUEST })
export class AppValidationPipe implements PipeTransform<unknown> {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    const validator = new ValidationPipe({
      exceptionFactory,
      transform: true,
      //whitelist: true,
      transformOptions: { enableImplicitConversion: true, groups: [this.request.user?.role].filter(i => i) },
      validateCustomDecorators: true,
    });
    return validator.transform(value, metadata);
  }
}
