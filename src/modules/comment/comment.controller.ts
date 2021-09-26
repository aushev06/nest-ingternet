import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormInterceptor } from 'src/common/form.interceptor';
import { CommentEntity } from 'src/entities/comment.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-guard';
import { SaveCommentDto } from 'src/modules/comment/comment.dto';
import { CommentService } from 'src/modules/comment/comment.service';

@Controller('comments')
@ApiTags('comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FormInterceptor(({ req }) => {
      req.body.user = req.user;
    }),
  )
  async store(@Body() dto: SaveCommentDto): Promise<CommentEntity> {
    return await this.service.store(dto);
  }
}
