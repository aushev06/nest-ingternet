import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { StatusEnum } from 'src/common/enums/status.enum';
import { BaseDto, PaginatedDto, ThemeDto } from 'src/dto/dtos';
import { CategoryEntity } from 'src/entities/category.entity';
import { ThemeEntity } from 'src/entities/theme.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Exists } from 'src/validators/exists.validator';
import { Slugify } from 'src/validators/slugify.validator';

export class SearchPostDto extends PaginatedDto {
  @ApiProperty({
    required: false,
    example: 'Title',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    required: false,
    example: '1,2,3',
  })
  @IsString()
  @IsOptional()
  category_ids: string;

  @ApiProperty({
    required: false,
    example: '1,2,3',
  })
  @IsString()
  @IsOptional()
  user_ids: string;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  is_popular: number;

  @ApiProperty({ example: 'active', enum: StatusEnum, required: false })
  @IsEnum(StatusEnum)
  status: StatusEnum = StatusEnum.ACTIVE;
}

export class SavePostDto {
  @ApiProperty()
  @IsString()
  @Validate(Slugify)
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  img: string;

  @ApiProperty()
  @IsJSON()
  body: unknown;

  @ApiProperty()
  @Validate(
    Exists,
    [
      CategoryEntity,
      ({ object: dto }): { id: number } => ({
        id: dto?.category.id,
      }),
    ],
    { message: 'Category with this id is not exist' },
  )
  category: BaseDto;

  @ApiProperty({ isArray: true })
  @ValidateNested({ each: true })
  themes: ThemeDto;

  user: UserEntity;
}
