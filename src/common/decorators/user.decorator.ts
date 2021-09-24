import { createParamDecorator, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

export const enum Role {
  USER = 'USER',
  CHEF = 'CHEF',
  STAFF = 'STAFF',
  SUPPLIER = 'SUPPLIER',
  CLOUD_KITCHEN = 'CLOUD_KITCHEN',
}

export const User = createParamDecorator((data: Role | Role[], ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as Express.Request;
  if (!req.user) {
    throw new UnauthorizedException('User not authentificated');
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
