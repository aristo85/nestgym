import {
  Controller,
  Body,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
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
import { ForgotPassword } from '../users/forgotPassword.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Authentication (Аутентификация)')
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

  @ApiTags('Authentication (Аутентификация)')
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

  // confirmation on forgot password link from client's email
  @Get('confirm/:id')
  async forgotPassConfirmation(@Param('id') id: number) {
    // check forgotPasswordRequest
    const forgotP = await ForgotPassword.findOne({ where: { id } });
    if (!forgotP) {
      throw new NotFoundException('this link not exists anymore');
    }
    // check expiration
    if (forgotP) {
      const newDate = new Date().getTime();
      const expiringAt = forgotP.updatedAt.getTime() + 1800000;
      if (newDate > expiringAt) {
        // if expired confirmation then delete it
        await ForgotPassword.destroy({ where: { id } });
        throw new ForbiddenException('expired confirmation');
      }
    }

    const {
      numberOfAffectedRows,
      randomstring,
    } = await this.authService.forgotPassConfirmation(forgotP.email);

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This user doesn't exist");
    }

    await ForgotPassword.destroy({ where: { id } });

    return `<div><p>Your new password is: </p><h3> ${randomstring}</h3>`;
  }
}
