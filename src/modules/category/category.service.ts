import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { StatusEnum } from 'src/common/enums/status.enum';
import { PaginatedDto } from 'src/dto/dtos';
import { CategoryEntity } from 'src/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/modules/category/category.dto';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}
  async getForDirectories(): Promise<CategoryEntity[]> {
    return await this.repository.find({
      where: {
        status: StatusEnum.ACTIVE,
      },
    });
  }

  async findAll(pages: PaginatedDto): Promise<[CategoryEntity[], number]> {
    const qb = this.repository.createQueryBuilder('c');

    return await qb
      .skip((pages.page - 1) * pages.take)
      .take(pages.take)
      .orderBy('c.id', 'ASC')
      .getManyAndCount();
  }

  findOne(id: number): Promise<CategoryEntity> {
    return this.repository
      .createQueryBuilder('c')
      .where({ id })
      .getOne();
  }

  async create(form: CreateCategoryDto): Promise<CategoryEntity> {
    return this.repository.create({ ...form, slug: slugify(form.name) }).save({ reload: true });
  }

  async update(id: number, form: UpdateCategoryDto): Promise<CategoryEntity> {
    delete form.id;
    const category = await this.repository.findOneOrFail(id);
    Object.assign(category, { ...form });
    return category.save({ reload: true });
  }

  async remove(ids: string[]): Promise<string> {
    await this.repository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .delete()
      .execute();
    return `Removed  #${ids.join(',')} categories`;
  }

  async activeOrDisable(ids: number[], status: StatusEnum): Promise<UpdateResult> {
    try {
      const qb = this.repository
        .createQueryBuilder('i')
        .update(CategoryEntity)
        .set({
          status,
        })
        .where('id IN (:...ids)', { ids });

      return await qb.execute();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
