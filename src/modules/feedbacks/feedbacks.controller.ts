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
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { photoPositionTypes } from '../photos/dto/photo.dto';
import { Photo } from '../photos/photo.entity';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { FeedbackDto } from './dto/feedback.dto';
import { Feedback } from './feedback.entity';
import { FeedbacksService } from './feedbacks.service';

@ApiBearerAuth()
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}
  ////////////////////////////////////
  @ApiTags('Client Feedback (Отзывы)')
  @ApiOperation({ summary: 'Создание отзыва' })
  @ApiResponse({ status: 201 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() feedback: FeedbackDto,
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ): Promise<Feedback> {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // check feedback redundancy
    const isFeedbackRedundant = await Feedback.findOne({
      where: { userId: user.id, userappId: feedback.userappId },
    });
    if (isFeedbackRedundant) {
      throw new ForbiddenException(
        'you cant rate this coach with the same app',
      );
    }
    // create a new feedback and return the newly created feedback
    return await this.feedbacksService.createFeedback(feedback, user.id);
  }

  ////////////////////////////////////
  @ApiTags('Client Feedback (Отзывы)')
  @ApiOperation({
    summary: 'Получение всех отзывов из БД. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200, description: 'Массив отзывов' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@UserRole() role: Roles) {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // get all feedback of one user in the db
    return await this.feedbacksService.findAllFeedbacks();
  }

  ////////////////////////////////////
  @ApiTags('Client Feedback (Отзывы)')
  @ApiOperation({
    summary: 'Получение всех тренеров которым можно оставить отзыв клиентом',
  })
  @ApiResponse({ status: 200, description: 'Массив тренеров' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/myCoaches/toFeedback')
  async findCoachesForFeedback(
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ) {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // get all feedback of one user in the db
    return await this.feedbacksService.findCoachesForFeedback(user.id);
  }

  ////////////////////////////////////
  @ApiTags('Client Feedback (Отзывы)')
  @ApiOperation({ summary: 'Получение отзыва клиента по id' })
  @ApiResponse({ status: 200, description: 'Найденный отзыв' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
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
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<Feedback> {
    // find the feedback with this id
    const feedback = await this.feedbacksService.findOneFeedback(
      id,
      user.id,
      role,
    );

    // if the feedback doesn't exit in the db, throw a 404 error
    if (!feedback) {
      throw new NotFoundException("This feedback doesn't exist");
    }

    // if feedback exist, return the feedback
    return feedback;
  }

  ////////////////////////////////////
  @ApiTags('Client Feedback (Отзывы)')
  @ApiOperation({
    summary: 'Удаление отзыва. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id отзыва',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // delete the feedback with this id
    const deleted = await this.feedbacksService.deleteFeedback(
      id,
      user.id,
      role,
    );

    // if the number of row affected is zero,
    // then the feedback doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This feedback doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }

  ////////////////////////////////////
  @ApiTags('coach Feedbacks (Отзывы)')
  @ApiOperation({
    summary: 'Получение всех отзывов тренера',
  })
  @ApiResponse({ status: 200, description: 'Массив отзывов' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Get('coach/feedbacks')
  async findAllCoachFeedback(@UserRole() role: Roles, @AuthUser() user: User) {
    // get all feedback of one user in the db
    return await this.feedbacksService.findAllCoachFeedbacks(user.id);
  }

  ////////////////////////////////////
  @ApiTags('Client Feedback (Отзывы)')
  // delete photo from feedback
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Удаление фото из отзыва клиента' })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'feedbackId',
    required: true,
    description: 'Id отзыва',
  })
  @ApiQuery({
    name: 'photoPosition',
    description: 'Позиция фото',
    enum: photoPositionTypes,
  })
  @ApiQuery({
    name: 'photoId',
    description: 'Id фото',
    type: 'number',
  })
  @Delete('photo/:feedbackId')
  async deleteFeedbackPhoto(
    @Param('feedbackId') feedbackId: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
    @Query() query: { photoPosition: photoPositionTypes; photoId: number },
  ) {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // check photo position
    const feedback = await this.feedbacksService.findFeedbackByPhotoPosition(
      feedbackId,
      query.photoPosition,
      query.photoId,
      user.id,
    );
    // check the photoId
    const photo: Photo = await Photo.findOne({
      where: { id: query.photoId },
      raw: true,
      nest: true,
    });
    if (!photo || !feedback) {
      throw new NotFoundException("This photo or feedback doesn't exist");
    }
    // delete the photo with this id
    const deleted = await this.feedbacksService.deleteFeedbackPhoto(
      feedbackId,
      query.photoPosition,
      query.photoId,
      photo.photoFileName,
      user.id,
    );

    // if the number of row affected is zero,
    // then the photo is exist in multiple modules
    if (deleted === 0) {
      return 'Successfully deleted from feedback';
    }

    // return success message
    return 'Successfully deleted';
  }
}
