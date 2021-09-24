import { PostEntity } from 'src/entities/post.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('likes')
export class LikeableEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(
    () => UserEntity,
    user => user.likes,
    { cascade: false, eager: false, nullable: false },
  )
  user: UserEntity;

  @ManyToOne(
    () => PostEntity,
    post => post.likes,
    { cascade: false, eager: false, nullable: false },
  )
  post: PostEntity;

  @Column()
  @Index()
  like_type: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
