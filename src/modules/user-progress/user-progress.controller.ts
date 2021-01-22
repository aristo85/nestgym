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
import { UserProgressDto } from './dto/user-progress.dto';
import { UserProgress } from './user-progress.entity';
import { UserProgressService } from './user-progress.service';

@ApiTags('Client Progress')
@ApiBearerAuth()
@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() progress: UserProgressDto,
    @Request() req,
  ): Promise<UserProgress> {
    // check the role
    if (req.user.role !== 'user') {
      throw new NotFoundException('Your role is not a user');
    }
    // create a new progress and return the newly created progress
    return await this.userProgressService.create(progress, req.user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req) {
    // get all progresss of one user in the db
    return await this.userProgressService.findAll(req.user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req): Promise<UserProgress> {
    // find the progress with this id
    const progress = await this.userProgressService.findOne(id, req.user.id);

    // if the progress doesn't exit in the db, throw a 404 error
    if (!progress) {
      throw new NotFoundException("This progress doesn't exist");
    }

    // if progress exist, return the progress
    return progress;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    // delete the app with this id
    const deleted = await this.userProgressService.delete(id, req.user.id);

    // if the number of row affected is zero,
    // then the app doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This app doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
