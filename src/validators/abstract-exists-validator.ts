import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { Connection, EntitySchema, FindConditions, ObjectType } from 'typeorm';

export interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  ];
}

export abstract class ExistsValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly connection: Connection) {}

  public async validate<E>(value: string, args: UniqueValidationArguments<E>): Promise<boolean> {
    const [EntityClass, findCondition = args.property] = args.constraints;
    if ((args.property === 'product' && value === undefined) || (args.property === 'supplier' && value === undefined)) {
      return true;
    }

    try {
      return (
        (await this.connection.getRepository(EntityClass).count({
          where:
            typeof findCondition === 'function'
              ? findCondition(args)
              : {
                  [findCondition || args.property]: value,
                },
        })) > 0
      );
    } catch (e) {
      return false;
    }
  }

  public defaultMessage(args: ValidationArguments): string {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with the same '${args.property}' doesn't exist`;
  }
}
