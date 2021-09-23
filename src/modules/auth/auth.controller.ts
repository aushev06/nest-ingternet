import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WebUser } from 'src/common/decorators/user.decorator';
import { AuthEmailDto, AuthJwtPayload, CreateUserDto } from 'src/modules/auth/auth.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-guard';
import { UserService } from 'src/modules/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService, private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() dto: AuthEmailDto): Promise<unknown> {
    return await this.service.login(dto);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<unknown> {
    return await this.service.register(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@WebUser() user: AuthJwtPayload): Promise<unknown> {
    return await this.userService.findOneById(user.id);
  }
}
