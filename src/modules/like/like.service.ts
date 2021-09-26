import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { LikeableEntity, LikeType } from 'src/entities/likeable.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(@InjectRepository(LikeableEntity) private readonly repository: Repository<LikeableEntity>) {}

  async set(postId: number, type: LikeType, user: UserInterface): Promise<void> {
    const qb = this.repository
      .createQueryBuilder()
      .where('post_id=:postId AND user_id=:userId', { postId, userId: user.id, type });

    // const postIsLiked = await qb.clone().getCount();

    const data = await this.repository.save({
      post: { id: postId },
      user: { id: user.id },
      likeType: type,
    });

    await qb
      .clone()
      .andWhere('id != :id', { id: data.id })
      .delete()
      .execute();
  }
}
