import { StatusEnum } from 'src/common/enums/status.enum';
import { PostEntity } from 'src/entities/post.entity';
import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('themes')
export class ThemeEntity extends BaseEntity {
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

  @Column({ nullable: true, default: 'active' })
  @Index()
  status: StatusEnum;
}
