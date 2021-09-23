import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { StatusEnum } from 'src/common/enums/status.enum';
import { UserEntity } from 'src/entities/user.entity';
import { Not, Unique } from 'typeorm';

export class AuthEmailDto {
  @ApiProperty({ example: 'web@meelz.me' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Qwerty123' })
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  remember?: boolean;
}

export class AuthDto {
  @ApiPropertyOptional({
    oneOf: [
      { type: 'string', example: '88005553535' },
      { type: 'string', example: 'web@site.ru' },
    ],
  })
  @IsOptional()
  login?: string;

  @ApiPropertyOptional({ example: 'Qwerty123' })
  @IsNotEmpty()
  @IsOptional()
  token?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsNotEmpty()
  @IsOptional()
  socialId?: string;

  @ApiPropertyOptional({ example: 'facebook' })
  @IsNotEmpty()
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  remember?: boolean;
}

export class AuthJwtPayload {
  id: number;
  sub: string;
}

export class SaveUserDto {
  @ApiProperty({ description: 'Any string' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Any string' })
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ description: 'Optional avatar url string or null' })
  @IsOptional()
  image?: string | null = null;

  @ApiProperty({ description: 'Email must be unique' })
  @IsNotEmpty()
  @IsEmail()
  @Validate(
    Unique,
    [
      UserEntity,
      ({ object: { email, socialId } }): { email: string; status: StatusEnum; socialId: number } => ({
        email,
        status: StatusEnum.ACTIVE,
        socialId: socialId || 0,
      }),
    ],
    {
      message: () => `Email is already exist`,
    },
  )
  email: string;

  @ApiProperty({ description: 'Phone must be unique. International phone format +999999999999' })
  @IsNotEmpty()
  @Validate(
    Unique,
    [
      UserEntity,
      ({ object: { phone, id } }): { phone: string; id: number } => ({
        phone,
        id,
      }),
    ],
    {
      message: (): string => `Phone is already exist`,
    },
  )
  phone: string;

  @ApiPropertyOptional({ description: 'Date ISO8601 formatted date' })
  @IsDate()
  @IsOptional()
  @Transform(val => (val.value ? val.value : null))
  birthday?: Date;

  @ApiPropertyOptional({ enum: ['male', 'femail'], description: 'gender is optional field' })
  @IsOptional()
  @IsString()
  @Transform(val => (val.value ? val.value : null))
  gender?: string;

  @ApiPropertyOptional({ description: 'Allow sms notifications' })
  @IsOptional()
  @IsBoolean()
  isSmsNotification?: boolean;

  @ApiPropertyOptional({ description: 'Allow push notifications' })
  @IsOptional()
  @IsBoolean()
  isPushNotification?: boolean;
  @ApiPropertyOptional({ description: 'Allow email notifications' })
  @IsOptional()
  @IsBoolean()
  isEmailNotification?: boolean;
}

export class CreateUserDto extends SaveUserDto {
  @ApiProperty({ description: 'Regex format is ^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$' })
  @IsOptional()
  password: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsOptional()
  socialId?: string;

  @ApiProperty({ example: 'facebook' })
  @IsNotEmpty()
  @IsOptional()
  provider?: string;

  @ApiProperty({ description: 'Regex not used currently but will be added phone validator in future' })
  @IsOptional()
  @Validate(
    Unique,
    [
      UserEntity,
      ({ object: { phone, socialId } }): { phone: string; socialId: unknown } => {
        const criteria = {
          phone,
          socialId: Not(socialId || 0),
        };

        if (!socialId) {
          delete criteria.socialId;
        }

        return criteria;
      },
    ],
    {
      message: (): string => `Phone is already exist`,
    },
  )
  phone: string;

  @ApiProperty({ description: 'Email must be unique' })
  @IsOptional()
  @IsEmail()
  @Validate(
    Unique,
    [
      UserEntity,
      ({ object: { email, socialId } }): { email: string; socialId: unknown } => {
        const criteria = {
          email,
          socialId: Not(socialId || 0),
        };
        if (!socialId) {
          delete criteria.socialId;
        }
        return criteria;
      },
    ],
    {
      message: () => `Email is already exist`,
    },
  )
  email: string;
}

export class UpdateUserDto extends SaveUserDto {
  @ApiProperty()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiPropertyOptional({ enum: ['male', 'female'], description: 'gender is optional field' })
  @IsOptional()
  @IsString()
  @Transform(val => (val.value ? val.value : null))
  gender?: string = null;

  @ApiPropertyOptional({ description: 'Date ISO8601 formatted date' })
  @IsDate()
  @IsOptional()
  @Transform(val => (val.value ? val.value : null))
  birthday?: Date = null;

  @ApiProperty({ description: 'Email must be unique' })
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  @Validate(
    Unique,
    [
      UserEntity,
      ({ object: { email, socialId } }): { email: string; status: StatusEnum; socialId: number } => ({
        email,
        status: StatusEnum.ACTIVE,
        socialId: socialId || 0,
      }),
    ],
    {
      message: () => `Email is already exist`,
    },
  )
  email: string;

  @ApiProperty({ description: 'Phone must be unique. International phone format +999999999999' })
  @IsNotEmpty()
  @IsOptional()
  @Validate(
    Unique,
    [
      UserEntity,
      ({ object: { phone, id } }): { phone: string; id: number } => ({
        phone,
        id,
      }),
    ],
    {
      message: (): string => `Phone is already exist`,
    },
  )
  phone: string;
}
