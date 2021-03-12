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
  Req,
  ForbiddenException,
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
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { PlaceDto } from './dto/place.dto';
import { Place } from './place.entity';
import { PlacesService } from './places.service';

@ApiTags('Given Place List (Места занятий спортом)')
@ApiBearerAuth()
@Controller('places')
export class PlacesController {
  constructor(private readonly placeService: PlacesService) {}

  @ApiOperation({
    summary: 'Создание места. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() place: PlaceDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<Place> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // create a new place and return the newly created place
    return await this.placeService.createPlace(place, user.id);
  }

  @ApiOperation({
    summary: 'Получение всех мест',
  })
  @ApiResponse({ status: 200, description: 'Массив мест' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request & { res: Response }) {
    // get all places in the db
    const list = await this.placeService.findAllPlaces();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiOperation({
    summary: 'Получение места по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200, description: 'Найденное место' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id места',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @UserRole() role: Roles,
  ): Promise<Place> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // find the place with this id
    const place = await this.placeService.findOnePlace(id);

    // if the place doesn't exit in the db, throw a 404 error
    if (!place) {
      throw new NotFoundException("This place doesn't exist");
    }
    // if place exist, return place
    return place;
  }

  @ApiOperation({
    summary: 'Редактирование места по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id места',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() place: PlaceDto,
    @UserRole() role: Roles,
  ): Promise<Place> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // get the number of row affected and the updated place
    const {
      numberOfAffectedRows,
      updatedPlace,
    } = await this.placeService.updatePlace(id, place);

    // if the number of row affected is zero,
    // it means the place doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This place doesn't exist");
    }

    // return the updated place
    return updatedPlace;
  }

  @ApiOperation({
    summary: 'Удаление места по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id места',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserRole() role: Roles) {
    // check the role
    if (role !== 'admin') {
      throw new NotFoundException('Your role is not an admin');
    }
    // delete the place with this id
    const deleted = await this.placeService.deletePlace(id);

    // if the number of row affected is zero,
    // then the place doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This place doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
