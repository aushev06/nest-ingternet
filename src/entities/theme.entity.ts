import { PostEntity } from 'src/entities/post.entity';
import { BaseEntity, Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('themes')
export class ThemeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;
}
