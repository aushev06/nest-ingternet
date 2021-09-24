import { CallHandler, ExecutionContext, NestInterceptor, Type } from '@nestjs/common';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Request } from 'express';
import { pick, set } from 'lodash';
import { Observable } from 'rxjs';
import { EntityManager } from 'typeorm';

export function InjectParamIntoBodyInterceptor(
  pickPath: string,
  pastePath: string,
  fn?: ((picked: unknown, manager: EntityManager) => unknown | Promise<unknown>) | undefined,
): Type<NestInterceptor> {
  @Injectable({ scope: Scope.REQUEST })
  class Interceptor implements NestInterceptor {
    constructor(
      @Inject(REQUEST)
      private readonly req: Request,
      @InjectEntityManager()
      private readonly manager: EntityManager,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
      const req = context.switchToHttp().getRequest();
      const picked = pick(req.params, pickPath, null);
      if (fn) {
        const res = fn(picked, this.manager);
        if (res instanceof Promise) {
          set(this.req.body, pastePath, await (res as Promise<unknown>));
        } else {
          set(this.req.body, pastePath, res);
        }
      } else {
        set(this.req.body, pastePath, picked);
      }
      console.log('picked', picked, this.req.params);
      console.log(this.req.body);
      return next.handle();
    }
  }

  return Interceptor;
}
