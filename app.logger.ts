import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { Breadcrumb, Scope, Severity } from '@sentry/node';
import { NextFunction, Request, Response } from 'express';
import * as qs from 'qs';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  constructor(@InjectSentry() private readonly client: SentryService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url, baseUrl, query } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      console.log(
        `${method} ${baseUrl}${url} ${qs.stringify(query)} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
      this.logger.log(`${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);

      if (statusCode >= 400) {
        this.client.error(
          `${method} ${baseUrl}${url} ${JSON.stringify(query)} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        );
      }
    });

    next();
  }
}
