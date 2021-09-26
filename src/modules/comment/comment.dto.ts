import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Validate } from 'class-validator';
import { BaseDto } from 'src/dto/dtos';
import { CommentEntity } from 'src/entities/comment.entity';
import { ThemeEntity } from 'src/entities/theme.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Exists } from 'src/validators/exists.validator';
import {PostEntity} from "src/entities/post.entity";

export class SaveCommentDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @Validate(
    Exists,
    [
      UserEntity,
      ({ object: dto }): { id: number } => ({
        id: dto?.replyUser.id,
      }),
    ],
    { message: args => `'User with this id ${args.value.id} is not exist'` },
  )
  @IsOptional()
  replyUser: BaseDto;

  @ApiProperty()
  @Validate(
    Exists,
    [
      PostEntity,
      ({ object: dto }): { id: number } => ({
        id: dto?.post.id,
      }),
    ],
    { message: args => `'Post with this id ${args?.value?.id} is not exist'` },
  )
  post: BaseDto;

  @ApiProperty()
  @Validate(
    Exists,
    [
      CommentEntity,
      ({ object: dto }): { id: number } => ({
        id: dto?.parentComment.id,
      }),
    ],
    { message: args => `'Comment with this id ${args.value.id} is not exist'` },
  )
  @IsOptional()
  parentComment: BaseDto;

  user: UserEntity;
}
