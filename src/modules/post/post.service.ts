import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/common/enums/status.enum';
import { PostEntity } from 'src/entities/post.entity';
import { SavePostDto, SearchPostDto } from 'src/modules/post/post.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: Repository<PostEntity>,
  ) {}

  async findAll(dto: SearchPostDto): Promise<[PostEntity[], number]> {
    const qb = this.repository.createQueryBuilder('p');
    qb.leftJoinAndSelect('p.category', 'category');

    qb.where('p.status=:status');

    if (dto.title) {
      qb.andWhere('p.title ILIKE :title');
    }

    if (dto.category_ids) {
      qb.andWhere('p.category_id IN(:...categoryIds)');
    }

    return await qb
      .setParameters({
        title: `%${dto.title || ''}%`,
        userIds: dto.user_ids?.split(','),
        categoryIds: dto.category_ids?.split(','),
        status: StatusEnum.ACTIVE,
      })
      .skip((dto.page - 1) * dto.take)
      .take(dto.take)
      .getManyAndCount();
  }

  async findOne(id: number): Promise<PostEntity> {
    return await this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.user', 'user')
      .where('p.id=:id', { id })
      .getOne();
  }

  async store(dto: SavePostDto): Promise<PostEntity> {
    return await this.repository.create((dto as unknown) as PostEntity).save({
      reload: true,
    });
  }

  async update(id: number, dto: SavePostDto): Promise<PostEntity> {
    try {
      await this.repository.update(id, (dto as unknown) as PostEntity);
      return await this.findOne(id);
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getForDirectories(): Promise<PostEntity[]> {
    return await this.repository.find({
      take: 6,
      order: {
        id: 'DESC',
      },
    });
  }
}
