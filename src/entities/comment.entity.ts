import { StatusEnum } from 'src/common/enums/status.enum';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comment')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(
    () => UserEntity,
    user => user.comments,
    { cascade: false, eager: false, nullable: true, onDelete: 'SET NULL' },
  )
  user: UserEntity;

  @ManyToOne(() => UserEntity, { cascade: false, eager: false, nullable: true, onDelete: 'SET NULL' })
  replyUser: UserEntity;

  @JoinColumn({ name: 'parent_comment_id' })
  @ManyToOne(
    () => CommentEntity,
    product => product.comments,
    {
      eager: false,
      cascade: false,
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  parentComment: CommentEntity;

  @OneToMany(
    () => CommentEntity,
    e => e.parentComment,
  )
  comments: CommentEntity[];

  @ManyToOne(
    () => PostEntity,
    post => post.likes,
    { cascade: false, eager: false, nullable: true, onDelete: 'SET NULL' },
  )
  post: PostEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
