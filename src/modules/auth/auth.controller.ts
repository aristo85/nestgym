import { Controller, Body, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto, Credential } from '../users/dto/user.dto';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../users/user.entity';

@ApiTags('Authentication (Аутентификация)')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 201, description: '{user, token }' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() credential: Credential,
    @Request() req: Request & { user: User },
  ) {
    return await this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: '{user, token }' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(DoesUserExist)
  @Post('signup')
  async signUp(@Body() user: UserDto) {
    const email = (user?.email).toLowerCase();
    return await this.authService.create({ ...user, email });
  }
}
