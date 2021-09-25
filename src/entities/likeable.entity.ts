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

export enum LikeType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

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
  likeType: LikeType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
