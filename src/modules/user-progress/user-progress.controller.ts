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
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { photoPositionTypes } from '../photos/dto/photo.dto';
import { Photo } from '../photos/photo.entity';
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

  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'photoPosition', enum: photoPositionTypes })
  @ApiQuery({ name: 'photoId', type: 'number' })
  @Delete('photo/:progressId')
  async deleteProgressPhoto(
    @Param('progressId') progressId: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
    @Query() query: { photoPosition: photoPositionTypes; photoId: number },
  ) {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // check photo position
    const progress = await this.userProgressService.findProgressByPhotoPosition(
      progressId,
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
    if (!photo || !progress) {
      throw new NotFoundException("This photo or progress doesn't exist");
    }
    // delete the photo with this id
    const deleted = await this.userProgressService.deleteProgressPhoto(
      progressId,
      query.photoPosition,
      query.photoId,
      photo.photoFileName,
      user.id,
    );

    // if the number of row affected is zero,
    // then the photo is exist in multiple modules
    if (deleted === 0) {
      return 'Successfully deleted from progress';
    }

    // return success message
    return 'Successfully deleted';
  }
}
