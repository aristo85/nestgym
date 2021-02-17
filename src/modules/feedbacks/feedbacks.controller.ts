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
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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
      @Request() req,
    ): Promise<Feedback> {
      // check the role
      if (req.user.role !== 'user') {
        throw new NotFoundException('Your role is not a user');
      }
      // create a new feedback and return the newly created feedback
      return await this.feedbacksService.create(feedback, req.user.id);
    }
  
    @ApiResponse({ status: 200 })
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(@Req() req) {
      // get all feedback of one user in the db
      return await this.feedbacksService.findAll(req.user.id);
    }
  
    @ApiResponse({ status: 200 })
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req): Promise<Feedback> {
      // find the feedback with this id
      const feedback = await this.feedbacksService.findOne(id, req.user.id);
  
      // if the feedback doesn't exit in the db, throw a 404 error
      if (!feedback) {
        throw new NotFoundException("This feedback doesn't exist");
      }
  
      // if feedback exist, return the feedback
      return feedback;
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Param('id') id: number, @Req() req) {
      // delete the feedback with this id
      const deleted = await this.feedbacksService.delete(id, req.user.id);
  
      // if the number of row affected is zero,
      // then the feedback doesn't exist in our db
      if (deleted === 0) {
        throw new NotFoundException("This feedback doesn't exist");
      }
  
      // return success message
      return 'Successfully deleted';
    }
  }
  