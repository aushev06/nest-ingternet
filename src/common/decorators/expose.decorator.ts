/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
import { Expose } from 'class-transformer';

import { Role } from './user.decorator';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const RoleExpose = (...roles: Role[]) => Expose({ groups: roles });
