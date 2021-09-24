import { Role } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/entities/user.entity';

declare global {
  namespace Express {
    interface User extends UserEntity {
      id: number;
      sub: string;
      role: Role;
    }

    interface Response {
      cookie(key: string, value: string, options?: unknown): void;
      send(data?: unknown);
      status(code: number);
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
