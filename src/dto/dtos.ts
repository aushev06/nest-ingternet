import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Validate } from 'class-validator';
import { ThemeEntity } from 'src/entities/theme.entity';
import { Exists } from 'src/validators/exists.validator';

export class BaseDto {
  @ApiProperty()
  @IsNumber()
  public id: number;
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public slug: string;
}

export class ThemeDto extends BaseDto {
  @Validate(
    Exists,
    [
      ThemeEntity,
      ({ object: dto }): { id: number } => ({
        id: dto?.id,
      }),
    ],
    { message: args => `'Theme with this ${args.value} is not exist'` },
  )
  @ApiProperty()
  @IsNumber()
  public id: number;
}

export class PaginatedDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiProperty({ required: false, description: 'Default value is 1 minimal posssible value is 1' })
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({ required: false, description: 'Default value is 10 minimal possible  value is 0' })
  take?: number = 10;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['id', 'title'], description: 'ordering by column' })
  orderBy?: string;
}

class Meta {
  @ApiProperty()
  total: number;
}
class ItemDto<T = unknown> {
  @ApiProperty()
  items: T[];
  @ApiProperty()
  meta: Meta;
}

export class ItemDeleteDto {
  count: number;
}

export class ItemUpdateDto extends ItemDeleteDto {}

export { ItemDto };
