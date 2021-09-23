import { StatusEnum } from 'src/common/enums/status.enum';
import { PostEntity } from 'src/entities/post.entity';
import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  slug: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  image: string;

  @OneToMany(
    () => PostEntity,
    entity => entity.category,
    { onDelete: 'CASCADE' },
  )
  posts: PostEntity[];

  @Column({ nullable: true, default: 'active' })
  @Index()
  status: StatusEnum;
}
