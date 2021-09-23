import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ValidatorConstraint } from 'class-validator';
import { ExistsValidator, UniqueValidationArguments } from 'src/validators/abstract-exists-validator';
import { Connection } from 'typeorm';

@ValidatorConstraint({ name: 'exists-update', async: true })
@Injectable()
export class ExistsUpdator extends ExistsValidator {
  constructor(@InjectConnection() protected readonly connection: Connection) {
    super(connection);
  }
  public async validate<E>(value: string, args: UniqueValidationArguments<E>): Promise<boolean> {
    const [EntityClass, findCondition = args.property] = args.constraints;

    try {
      const entity = await this.connection.getRepository(EntityClass).findOneOrFail({
        where:
          typeof findCondition === 'function'
            ? findCondition(args)
            : {
                [findCondition || args.property]: value,
              },
      });
      args.object[args.property] = entity;
      return !!entity;
    } catch (e) {
      return false;
    }
  }
}
