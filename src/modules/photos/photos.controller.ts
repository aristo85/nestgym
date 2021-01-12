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
import { PhotoDto } from './dto/photo.dto';
import { Photo } from './photo.entity';
import { PhotosService } from './photos.service';

@ApiTags('Photo')
@ApiBearerAuth()
@Controller('photos')
export class PhotosController {
  constructor(private readonly photoService: PhotosService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req) {
    // get all photo in the db
    return await this.photoService.findAll(req.user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number,  @Req() req): Promise<Photo> {
    // find the photo with this id
    const photo = await this.photoService.findOne(id, req.user.id);

    // if the photo doesn't exit in the db, throw a 404 error
    if (!photo) {
      throw new NotFoundException("This photo doesn't exist");
    }

    // if photo exist, return the photo
    return photo;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() photo: PhotoDto, @Request() req): Promise<Photo> {
    // create a new photo and return the newly created photo
    return await this.photoService.create(photo, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    // delete the app with this id
    const deleted = await this.photoService.delete(id, req.user.id);

    // if the number of row affected is zero,
    // then the app doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This app doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
