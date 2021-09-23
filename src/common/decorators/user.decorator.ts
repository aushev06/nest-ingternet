import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WebUser = createParamDecorator((data: string | string[], ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as Express.Request;

  return req.user;
});
