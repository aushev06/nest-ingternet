import { Exclude } from 'class-transformer';
import { StatusEnum } from 'src/common/enums/status.enum';
import { CommentEntity } from 'src/entities/comment.entity';
import { LikeableEntity } from 'src/entities/likeable.entity';
import { PostEntity } from 'src/entities/post.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: false })
  phone: string;

  @Column({ unique: false })
  email: string;

  @Column()
  @Exclude()
  password_hash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  image: string | null;

  @Column({ nullable: true })
  gender: string | null;

  @Column({ nullable: true })
  provider: string | null;

  @Column({ nullable: true })
  socialId: string;

  @Column({ nullable: true })
  birthday?: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isSmsNotification: boolean;

  @Column({ default: false })
  isPushNotification: boolean;

  @Column({ default: false })
  isEmailNotification: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  activatedAt?: Date;

  @Column({ nullable: true, default: 'pending' })
  @Index()
  status: StatusEnum;

  get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  @OneToMany(
    () => PostEntity,
    entity => entity.user,
  )
  posts: PostEntity[];

  @OneToMany(
    () => PostEntity,
    entity => entity.user,
  )
  likes: LikeableEntity[];

  @OneToMany(
    () => CommentEntity,
    entity => entity.user,
  )
  comments: CommentEntity[];
}
