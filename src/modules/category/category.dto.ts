import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import slugify from 'slugify';
import { StatusEnum } from 'src/common/enums/status.enum';
import { BaseDto } from 'src/dto/dtos';
import { CategoryEntity } from 'src/entities/category.entity';
import { Unique } from 'src/validators/unique.validator';

export class CreateCategoryDto extends OmitType(BaseDto, ['id', 'slug']) {
  @ApiProperty()
  @IsString()
  @Validate(
    Unique,
    [
      CategoryEntity,
      ({ object: dto }): { name: string; id: number } => ({
        name: dto?.name,
        id: dto?.id,
      }),
    ],
    { message: 'Category with this name already exist' },
  )
  name: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty({ example: 'active', enum: StatusEnum })
  @IsEnum(StatusEnum)
  status: StatusEnum;
}

export class UpdateCategoryDto {
  @ApiProperty()
  @IsString()
  @Validate(
    Unique,
    [
      CategoryEntity,
      ({ object: dto }): { name: string; id: number } => ({
        name: dto?.name,
        id: dto?.id,
      }),
    ],
    { message: 'Category with this name already exist' },
  )
  name: string;
  @ApiProperty({ example: 'active', enum: StatusEnum })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty()
  @IsString()
  image: string;

  id: number;
}
