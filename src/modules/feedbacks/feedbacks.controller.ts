import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { FeedbackDto } from './dto/feedback.dto';
import { Feedback } from './feedback.entity';
import { FeedbacksService } from './feedbacks.service';

@ApiTags('Client Feedback')
@ApiBearerAuth()
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

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
    // create a new feedback and return the newly created feedback
    return await this.feedbacksService.createFeedback(feedback, user.id);
  }

  @ApiResponse({ status: 200 })
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

  @ApiResponse({ status: 200 })
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

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
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
}
