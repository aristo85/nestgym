import {
  Controller,
  Post,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { GCFeedbackDto } from './dto/get-caoch-feedback.dto';
import { GetCaochFeedbackService } from './get-caoch-feedback.service';

@ApiBearerAuth()
@Controller('get-caoch-feedback')
export class GetCaochFeedbackController {
  constructor(private readonly GCFeedbacksService: GetCaochFeedbackService) {}
  ////////////////////////////////////
  @ApiTags('GetCoach Feedback (Обратная связь)')
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() feedback: GCFeedbackDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role === 'admin') {
      throw new ForbiddenException('Your role is admin');
    }

    // create a new feedback and return the newly created feedback
    return await this.GCFeedbacksService.sendFeedback(feedback, user);
  }

  ////////////////////////////////////
}
