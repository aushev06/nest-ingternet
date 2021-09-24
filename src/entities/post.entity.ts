import { StatusEnum } from 'src/common/enums/status.enum';
import { CategoryEntity } from 'src/entities/category.entity';
import { LikeableEntity } from 'src/entities/likeable.entity';
import { ThemeEntity } from 'src/entities/theme.entity';
import { UserEntity } from 'src/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  body: unknown;

  @Column({ type: 'jsonb', nullable: true })
  meta!: {
    title: string;
    description: string;
  };

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  img: string;

  @Column({ default: 0 })
  views: number;

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

  @ManyToOne(
    () => UserEntity,
    entity => entity.posts,
    {
      onDelete: 'SET NULL',
      nullable: true,
      cascade: false,
    },
  )
  user: UserEntity;

  @ManyToOne(
    () => CategoryEntity,
    entity => entity.posts,
    {
      onDelete: 'SET NULL',
      nullable: true,
      cascade: false,
    },
  )
  category: CategoryEntity;

  @ManyToMany(() => ThemeEntity)
  themes: ThemeEntity[];

  @OneToMany(
    () => LikeableEntity,
    entity => entity.post,
  )
  likes: LikeableEntity[];
}
