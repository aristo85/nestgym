import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
  Post,
  Delete,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { ProfileDto, ProfileUpdateDto } from './dto/profile.dto';
import { Profile } from './profile.entity';
import { ProfilesService } from './profiles.service';

@ApiTags('Client-Profile (Профиль клиента)')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileServise: ProfilesService) {}

  @ApiOperation({ summary: 'Создание профиля клиента' })
  @ApiResponse({ status: 201 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() profile: ProfileDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<Profile> {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // check if user already has a profile
    const isProfile = await Profile.findOne({
      where: {
        userId: user.id,
      },
    });
    if (isProfile) {
      throw new ForbiddenException('This User already has a profile');
    }

    // create a new profile and return the newly created profile
    return await this.profileServise.createClientProfile(profile, user.id);
  }

  @ApiOperation({
    summary: 'Получение всех профилей клиентов. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200, description: 'Массив профилей' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@UserRole() role: Roles): Promise<Profile[]> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // find the profile with this id
    const profile = await this.profileServise.findAllClientProfiles();

    // if the profile doesn't exit in the db, throw a 404 error
    if (!profile) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profile exist, return the profile
    return profile;
  }

  @ApiOperation({ summary: 'Получение профиля клиента по id' })
  @ApiResponse({ status: 200, description: 'Найденный профиль' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id профиля',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Profile> {
    // find the profiles with this id
    const profiles = await this.profileServise.findOneClientProfile(id);

    // if the profiles doesn't exit in the db, throw a 404 error
    if (!profiles) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profiles exist, return profiles
    return profiles;
  }

  @ApiOperation({ summary: 'Получение профиля Юзера, если он клиент' })
  @ApiResponse({ status: 200, description: 'Найденный профиль' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @UseGuards(AuthGuard('jwt'))
  @Get('client/myprofile')
  async findMyProfile(@AuthUser() user: User): Promise<Profile> {
    // find the profiles with this id
    const profiles = await this.profileServise.findMyClientProfile(user.id);

    // if the profiles doesn't exit in the db, throw a 404 error
    if (!profiles) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profiles exist, return profiles
    return profiles;
  }

  @ApiOperation({ summary: 'Редактирование профиля клиента' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id профиля',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: ProfileUpdateDto,
    @AuthUser() user: User,
  ): Promise<Profile> {
    // get the number of row affected and the updated profile
    const {
      numberOfAffectedRows,
      updatedProfile,
    } = await this.profileServise.updateClientProfile(id, data, user.id);

    // if the number of row affected is zero,
    // it means the profile doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return the updated profile
    return updatedProfile;
  }

  // ////////////
  @ApiOperation({ summary: 'Удаление профиля клиента' })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id профиля',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteProfile(@Param('id') id: number, @AuthUser() user: User) {
    const isProfile = await Profile.findOne({ where: { id, userId: user.id } });
    if (!isProfile) {
      throw new NotFoundException("This profile doesn't exist");
    }
    const deleted = await this.profileServise.deleteClientProfile(id, user);
    // if the number of row affected is zero,
    // then the profile doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
  /////////////////////////////////

  @ApiOperation({ summary: 'Удаление фото из профиля клиента' })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'profileId',
    required: true,
    description: 'Id профиля',
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
  @UseGuards(AuthGuard('jwt'))
  @Delete('photo/:profileId')
  async deleteProfilePhoto(
    @Param('profileId') profileId: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
    @Query() query: { photoPosition: photoPositionTypes; photoId: number },
  ) {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // check photo position
    const profile = await this.profileServise.findProfileByPhotoPosition(
      profileId,
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
    if (!photo || !profile) {
      throw new NotFoundException("This photo or profile doesn't exist");
    }
    // delete the photo with this id
    const deleted = await this.profileServise.deleteProfilePhoto(
      profileId,
      query.photoPosition,
      query.photoId,
      photo.photoFileName,
      user.id,
    );

    // if the number of row affected is zero,
    // then the photo is exist in multiple modules
    if (deleted === 0) {
      return 'Successfully deleted from profile';
    }

    // return success message
    return 'Successfully deleted';
  }
}
