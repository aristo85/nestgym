import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { Profile } from '../profiles/profile.entity';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { GCFeedbackDto } from './dto/get-caoch-feedback.dto';
import { GCFeedback } from './get-caoch-feedback.entity';
import { GetCaochFeedbackService } from './get-caoch-feedback.service';

@ApiBearerAuth()
@Controller('get-caoch-feedback')
export class GetCaochFeedbackController {
  constructor(private readonly GCFeedbacksService: GetCaochFeedbackService) {}
  ////////////////////////////////////
  @ApiTags('GetCoach Feedback (Обратная связь)')
  @ApiOperation({ summary: 'Создание ОС' })
  @ApiResponse({ status: 201 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() feedback: GCFeedbackDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<GCFeedback> {
    // check the role
    if (role === 'admin') {
      throw new ForbiddenException('Your role is admin');
    }
    // client name
    let userName;
    if (role === 'user') {
      userName = await Profile.findOne({
        where: { userId: user.id },
        attributes: ['fullName'],
        raw: true,
      });
    }
    if (role === 'trainer') {
      userName = await CoachProfile.findOne({
        where: { userId: user.id },
        attributes: ['fullName'],
        raw: true,
      });
    }

    console.log(userName);
    // create a new feedback and return the newly created feedback
    return await this.GCFeedbacksService.createGCFeedback(
      feedback,
      user.id,
      userName?.fullName,
    );
  }

  ////////////////////////////////////
  @ApiTags('GetCoach Feedback (Обратная связь)')
  @ApiOperation({
    summary: 'Получение всех ОС из БД. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200, description: 'Массив ОС' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { res: Response },
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // get all feedback of one user in the db
    const list = await this.GCFeedbacksService.findAllFeedbacks();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  ////////////////////////////////////
  @ApiTags('GetCoach Feedback (Обратная связь)')
  @ApiOperation({
    summary: 'Получение ОС по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200, description: 'Найденная ОС' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id Заявки',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @UserRole() role: Roles,
  ): Promise<GCFeedback> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // find the feedback with this id
    const feedback = await this.GCFeedbacksService.findOneGCFeedback(id);

    // if the feedback doesn't exit in the db, throw a 404 error
    if (!feedback) {
      throw new NotFoundException("This feedback doesn't exist");
    }

    // if feedback exist, return the feedback
    return feedback;
  }

  ////////////////////////////////////
  @ApiTags('GetCoach Feedback (Обратная связь)')
  @ApiOperation({
    summary: 'Удаление ОС. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id ОС',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserRole() role: Roles) {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // delete the feedback with this id
    const deleted = await this.GCFeedbacksService.deleteGCFeedback(id);

    // if the number of row affected is zero,
    // then the feedback doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This feedback doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
