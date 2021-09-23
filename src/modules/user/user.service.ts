import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto, SaveUserDto, UpdateUserDto } from 'src/modules/auth/auth.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.repository.findOne({ email });
  }

  async findOneById(id: number): Promise<UserEntity> {
    return await this.repository.findOne({ id });
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.prepareUser(dto, new UserEntity());

    return await this.repository.save(user, { reload: true });
  }

  private async prepareUser(dto: CreateUserDto | SaveUserDto | UpdateUserDto, user: UserEntity): Promise<UserEntity> {
    if (dto instanceof CreateUserDto) {
      if (dto.password) {
        user.password_hash = await bcrypt.hash(dto.password, 12);
      }

      if (dto.socialId && dto.provider) {
        user.provider = dto.provider;
        user.socialId = dto.socialId;
      }
    }

    Object.assign(user, dto);

    return user;
  }
}
