import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/modules/category/category.module';
import { PostModule } from 'src/modules/post/post.module';
import { Exists } from 'src/validators/exists.validator';
import { Unique } from 'src/validators/unique.validator';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { LikeModule } from './modules/like/like.module';
import { CommentModule } from './modules/comment/comment.module';

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
      synchronize: true,
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
    CategoryModule,
    PostModule,
    LikeModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService, Exists, Unique],
})
export class AppModule {}
