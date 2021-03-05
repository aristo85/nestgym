import { Controller, Body, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto, Credential } from '../users/dto/user.dto';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/user.entity';

@ApiTags('Authentication (Аутентификация)')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() credential: Credential,
    @Request() req: Request & { user: User },
  ) {
    return await this.authService.login(req.user);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(DoesUserExist)
  @Post('signup')
  async signUp(@Body() user: UserDto) {
    const email = (user?.email).toLowerCase();
    return await this.authService.create({ ...user, email });
  }
}
