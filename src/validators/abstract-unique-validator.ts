import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { Connection, EntitySchema, FindConditions, Not, ObjectType } from 'typeorm';

interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  ];
}

export abstract class UniqueValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly connection: Connection) {}

  public async validate<E>(value: string, args: UniqueValidationArguments<E>): Promise<boolean> {
    const [EntityClass, findCondition = args.property] = args.constraints;
    let findConditionArgs = null;
    if (typeof findCondition === 'function') {
      findConditionArgs = findCondition(args);
      if (findConditionArgs.id) {
        findConditionArgs.id = Not(findConditionArgs.id);
      }
    }

    try {
      return (
        (await this.connection.getRepository(EntityClass).count({
          where: findConditionArgs
            ? findConditionArgs
            : {
                [(findCondition as string) || args.property]: value,
              },
        })) <= 0
      );
    } catch (e) {
      return false;
    }
  }

  public defaultMessage(args: ValidationArguments): string {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with the same '${args.property}' already exist`;
  }
}
