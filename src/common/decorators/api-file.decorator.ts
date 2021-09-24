import { ApiBody } from '@nestjs/swagger';

export const ApiFile = (fileName = 'files'): MethodDecorator => (
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): void => {
  ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      required: [fileName],
      properties: {
        [fileName]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })(target, propertyKey, descriptor);
};
