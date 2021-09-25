import { Controller, Get, Param, ParseArrayPipe } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { LikeType } from 'src/entities/likeable.entity';
import { LikeService } from 'src/modules/like/like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly service: LikeService) {}

  @Get(`/:postId([\\d,]+)/:type(${LikeType.LIKE}|${LikeType.DISLIKE})`)
  @ApiParam({
    name: 'postId',
    schema: { type: 'number' },
  })
  @ApiParam({ name: 'type', enum: [LikeType.LIKE, LikeType.DISLIKE] })
  async set(
    @Param('postId')
    postId: number,
    @Param('type') type: LikeType,
    @User() user: UserInterface,
  ): Promise<void> {
    await this.service.set(postId, type, user);
  }
}
