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
import { Roles } from '../users/user.entity';
import { UserRole } from '../users/users.decorator';
import { PhotoDto, UpdatePhotoDto } from './dto/photo.dto';
import { Photo } from './photo.entity';
import { PhotosService } from './photos.service';

@ApiTags('Photo')
@ApiBearerAuth()
@Controller('photos')
export class PhotosController {
  constructor(private readonly photoService: PhotosService) {}

  @ApiOperation({ summary: 'Добавление фото' })
  @ApiResponse({ status: 201 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() data: UpdatePhotoDto): Promise<Photo[]> {
    // create a new photo and return the newly created photo
    const result = Promise.all(
      data.photosBase64.map(
        async (photo) => await this.photoService.create(photo),
      ),
    );
    return result;
  }

  @ApiOperation({
    summary: 'Получение всех Фото. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200, description: 'Массив фото' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@UserRole() role: Roles): Promise<any> {
    if (role !== 'admin') {
      throw new ForbiddenException('only admin');
    }
    // get all photos of one user in the db
    const list: any = await this.photoService.findAll();
    return list;
  }

  @ApiOperation({ summary: 'Получение фото по id' })
  @ApiResponse({ status: 200, description: 'Найденный фото' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id фото',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Photo> {
    // find the photo with this id
    const photo = await this.photoService.findOneById(id);

    // if the photo doesn't exit in the db, throw a 404 error
    if (!photo) {
      throw new NotFoundException("This photo doesn't exist");
    }

    // if photo exist, return the photo
    return photo;
  }

  @ApiOperation({ summary: 'Удаление фото' })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id фото',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const photo: any = (await this.photoService.findOneById(id)).get({
      plain: true,
    });
    if (!photo) {
      throw new NotFoundException("This photo doesn't exist");
    }
    // delete the photo with this id
    const deleted = await this.photoService.deletePhoto(
      id,
      photo.photoFileName,
    );

    // if the number of row affected is zero,
    // then the photo doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This photo doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
