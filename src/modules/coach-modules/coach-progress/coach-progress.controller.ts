import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/modules/users/user.entity';
import { AuthUser } from 'src/modules/users/users.decorator';
import { CoachProgressService } from './coach-progress.service';

@ApiTags('Coach reads their clients progress (Прогресс клиента у тренера)')
@ApiBearerAuth()
@Controller('coach-progress')
export class CoachProgressController {
  constructor(private readonly coachProgressService: CoachProgressService) {}

  @ApiOperation({
    summary: 'Получение прогресса клиента тренером по id клиента',
  })
  @ApiResponse({ status: 200, description: 'Найденный прогресс' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Id клиента',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  async findOne(
    @Param('userId') userId: number,
    @AuthUser() user: User,
  ): Promise<User> {
    // check the role
    if (user.role === 'user') {
      throw new HttpException(
        'Forbidden, your role is user',
        HttpStatus.FORBIDDEN,
      );
    }

    const users = await this.coachProgressService.getUserProgress(
      user.id,
      userId,
    );

    if (!users.length) {
      throw new HttpException('Not found active user', HttpStatus.NOT_FOUND);
    }

    return users.pop();
  }

  // get all my clients progress of a trainer
  @ApiOperation({
    summary: 'Получение всех прогрессов клиентов одного тренера',
  })
  @ApiResponse({ status: 200, description: 'Массив прогрессов' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { res: Response },
    @AuthUser() user: User,
  ) {
    // check the role
    if (user.role === 'user') {
      throw new NotFoundException(
        "your role is 'user', users dont have access to coaches info.! ",
      );
    }

    const users = await this.coachProgressService.getUsersProgress(
      user.id,
      user.id,
    );
    const count = users.length;

    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return users;
  }
}
