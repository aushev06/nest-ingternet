import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { SaveCommentDto } from 'src/modules/comment/comment.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly repository: Repository<CommentEntity>,
  ) {}

  async store(dto: SaveCommentDto): Promise<CommentEntity> {
    const comment = await this.repository.save(dto, { reload: true });
    return await this.findOne(comment.id);
  }

  async findOne(id: number): Promise<CommentEntity> {
    return await this.repository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.post', 'post')
      .leftJoinAndSelect('c.user', 'user')
      .leftJoinAndSelect('c.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'u')
      .whereInIds([2])
      .getOne();
  }
}
