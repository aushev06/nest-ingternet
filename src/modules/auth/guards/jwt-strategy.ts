import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthJwtPayload } from '../auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request): string => {
          let token = '';
          if (request.headers?.authorization && request.headers.authorization !== '') {
            token = request.headers?.authorization?.replace('Bearer ', '');
          } else {
            token = request.cookies?.token ?? '';
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'test',
    });
  }

  validate(payload: AuthJwtPayload): AuthJwtPayload {
    return { ...payload };
  }
}
