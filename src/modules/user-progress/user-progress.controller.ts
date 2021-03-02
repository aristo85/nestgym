import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { UserProgressDto } from './dto/user-progress.dto';
import { UserProgress } from './user-progress.entity';
import { UserProgressService } from './user-progress.service';

@ApiTags('Client Progress (Прогресс клиента)')
@ApiBearerAuth()
@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() progress: UserProgressDto,
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ): Promise<UserProgress> {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // create a new progress and return the newly created progress
    return await this.userProgressService.createProgress(progress, user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@AuthUser() user: User) {
    // get all progresss of one user in the db
    return await this.userProgressService.findAllProgresses(user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @AuthUser() user: User,
  ): Promise<UserProgress> {
    // find the progress with this id
    const progress = await this.userProgressService.findOneProgress(
      id,
      user.id,
    );

    // if the progress doesn't exit in the db, throw a 404 error
    if (!progress) {
      throw new NotFoundException("This progress doesn't exist");
    }

    // if progress exist, return the progress
    return progress;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // delete the progress with this id
    const deleted = await this.userProgressService.deleteProgress(id, user.id);

    // if the number of row affected is zero,
    // then the progress doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This progress doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
