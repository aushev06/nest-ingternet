import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role, User } from 'src/common/decorators/user.decorator';
import { StatusEnum } from 'src/common/enums/status.enum';
import { FormInterceptor } from 'src/common/form.interceptor';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ItemDto, PaginatedDto } from 'src/dto/dtos';
import { CategoryEntity } from 'src/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/modules/category/category.dto';
import { CategoryService } from 'src/modules/category/category.service';

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@User(Role.ADMIN) _: UserInterface, @Body() form: CreateCategoryDto): Promise<CategoryEntity> {
    return await this.categoryService.create(form);
  }

  @Get()
  async findAll(@Query() pages: PaginatedDto): Promise<ItemDto> {
    const [items, total] = await this.categoryService.findAll(pages);
    return {
      items,
      meta: { total },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryEntity> {
    return this.categoryService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(
    FormInterceptor(({ req }) => {
      req.body.id = req.params.id;
    }),
  )
  update(
    @User(Role.ADMIN) _: UserInterface,
    @Param('id') id: string,
    @Body() form: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.update(+id, form);
  }

  @Get(`/:ids([\\d,]+)/:status(${StatusEnum.ACTIVE}|${StatusEnum.DISABLED})`)
  @ApiParam({
    name: 'ids',
    schema: { type: 'array', items: { type: 'number' } },
  })
  @ApiParam({ name: 'status', enum: [StatusEnum.ACTIVE, StatusEnum.DISABLED] })
  async active(
    @Param('ids', new ParseArrayPipe({ separator: ',', items: Number }))
    ids: number[],
    @Param('status') status: StatusEnum,
    @User(Role.ADMIN) _: UserInterface,
  ): Promise<unknown> {
    const data = await this.categoryService.activeOrDisable(ids, status);
    return {
      count: data.affected,
    };
  }

  @Delete(':ids')
  remove(@User(Role.ADMIN) _: UserInterface, @Param('ids') ids: string): Promise<string> {
    return this.categoryService.remove(ids.split(','));
  }
}
