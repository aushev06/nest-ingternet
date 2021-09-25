import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeableEntity } from 'src/entities/likeable.entity';

import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikeableEntity])],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
