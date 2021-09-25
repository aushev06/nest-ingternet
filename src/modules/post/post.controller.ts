import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, User } from 'src/common/decorators/user.decorator';
import { StatusEnum } from 'src/common/enums/status.enum';
import { FormInterceptor } from 'src/common/form.interceptor';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ItemDto } from 'src/dto/dtos';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-guard';
import { SavePostDto, SearchPostDto } from 'src/modules/post/post.dto';
import { PostService } from 'src/modules/post/post.service';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get()
  async findAll(@Query() dto: SearchPostDto): Promise<ItemDto> {
    const [items, total] = await this.service.findAll(dto);

    return {
      items,
      meta: {
        total,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @User() user: UserInterface): Promise<PostEntity> {
    console.log(user);
    const post = await this.service.findOne(id);

    if (post.user.id !== user.id && post.status !== StatusEnum.ACTIVE) {
      throw new NotFoundException();
    }

    return post;
  }

  @Delete(':id')
  @ApiBearerAuth()
  async delete(@Param('id') id: number, @User() user: UserInterface): Promise<void> {
    const post = await this.service.findOne(id);

    if (user.role === Role.USER && post && +post.user.id !== +user.id) {
      throw new NotFoundException();
    }

    await this.service.remove(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FormInterceptor(({ req }) => {
      req.body.user = { id: req.user.id } as UserEntity;
    }),
  )
  async store(@Body() dto: SavePostDto): Promise<PostEntity> {
    return await this.service.store(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FormInterceptor(({ req }) => {
      req.body.user = { id: req.user.id } as UserEntity;
    }),
  )
  async update(@Param('id') id: number, @Body() dto: SavePostDto, @User() user: UserInterface): Promise<PostEntity> {
    const post = await this.service.findOne(id);
    if (user.role === Role.USER && post && +post.user.id !== +user.id) {
      throw new NotFoundException();
    }

    return await this.service.update(id, dto);
  }
}
