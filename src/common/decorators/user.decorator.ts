import { createParamDecorator, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';

export const enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

export const User = createParamDecorator((data: Role | Role[], ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as Express.Request;
  if (!req.user) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.user = ({ id: 0, sub: 'guest', role: Role.GUEST } as unknown) as UserEntity;
  }
  if (data !== undefined) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    if (data.length && !data.includes(req.user?.role)) {
      throw new ForbiddenException('You have no permission to do this action');
    }
  }

  return req.user;
});

export const WebUser = createParamDecorator((data: string | string[], ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as Express.Request;

  return req.user;
});
