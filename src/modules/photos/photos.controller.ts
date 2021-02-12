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

  
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() data: PhotoDto, @Request() req): Promise<string[]> {
    // check the role
    if (req.user.role !== 'user') {
      throw new NotFoundException('Your role is not a user');
    }

    // create a new photo and return the newly created photo
    for(const photo of data.photos){
      return await this.photoService.create(photo.photo, req.user.id, {}, {});
    }
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req): Promise<any> {
    if(req.user.role !== "admin"){
      throw new NotFoundException("only admin");
    }
    // get all photos of one user in the db
    const list: any = (await this.photoService.findAll({},{})
    );
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req): Promise<Photo> {
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
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const photo: any = await Photo.findOne<Photo>({ where: { id } });
    if (!photo) {
      throw new NotFoundException("This photo doesn't exist");
    }
    const plainPhoto = photo.get({ plain: true });
    // delete the photo with this id
    const deleted = await this.photoService.delete(
      id,
      req.user.id,
      plainPhoto.photo,
      {},
      {}
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
