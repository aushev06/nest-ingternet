import { Module, Scope } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exists } from 'src/validators/exists.validator';
import { Unique } from 'src/validators/unique.validator';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppFilter } from '../app.filter';
import { AppValidationPipe } from '../app.validation-pipe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      namingStrategy: new SnakeNamingStrategy(),
      name: 'default',
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      logging: process.env.NODE_ENV === 'test' ? false : ['error'],
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      entities: [__dirname + '/entities/**/*.entity{.js,.ts}', __dirname + '/entities/**/*.view{.js,.ts}'],
      synchronize: false,
      migrationsRun: true,
      keepConnectionAlive: true,
      cache: {
        type: 'ioredis',
        options: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        },
      },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Exists,
    Unique,
    {
      provide: APP_FILTER,
      useClass: AppFilter,
    },
    {
      provide: APP_PIPE,
      useClass: AppValidationPipe,
      scope: Scope.REQUEST,
    },
  ],
})
export class AppModule {}
