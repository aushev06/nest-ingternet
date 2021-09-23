import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StatusEnum } from 'src/common/enums/status.enum';
import { UserEntity } from 'src/entities/user.entity';
import { AuthDto, AuthEmailDto, CreateUserDto } from 'src/modules/auth/auth.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async login(dto: AuthDto & AuthEmailDto): Promise<unknown> {
    const user = await this.userService.findOneByEmail(dto.email);

    if (!user || user.status !== StatusEnum.ACTIVE) {
      throw new NotFoundException('User is not found or not activated');
    }

    if (!(await this.comparePasswords(dto.password, user.password_hash))) {
      throw new HttpException('Login or password is incorrect', 401);
    }

    const token = await this.generateJWT(
      user,
      dto.remember ? process.env.JWT_EXPIRE : process.env.JWT_EXPIRE_FOR_REMEMBER,
    );

    return {
      ...user,
      token,
    };
  }

  async register(dto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.create(dto);
  }

  comparePasswords(password: string, passwortHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwortHash);
  }

  generateJWT(user: UserEntity, expire = process.env.JWT_EXPIRE): Promise<string> {
    return this.jwtService.signAsync(
      { sub: 'user', id: user.id },
      {
        expiresIn: expire,
      },
    );
  }
}
