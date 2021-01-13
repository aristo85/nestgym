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
import { RequestedappsService } from './requestedapps.service';

@ApiTags('Request-Matching')
@ApiBearerAuth()
@Controller('requestedapps')
export class RequestedappsController {
  constructor(private readonly requstedappService: RequestedappsService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get('matches')
  async findAllCoachProfiles(@Req() req) {
    // get all apps in the db
    const list = await this.requstedappService.findAllCoachProfiles();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }






  // @ApiResponse({ status: 200 })
  // @UseGuards(AuthGuard('jwt'))
  // @Get()
  // async findAll(@Req() req) {
  //   // get all apps in the db
  //   const list = await this.userappService.findAll(req.user);
  //   const count = list.length;
  //   req.res.set('Access-Control-Expose-Headers', 'Content-Range');
  //   req.res.set('Content-Range', `0-${count}/${count}`);
  //   return list;
  // }

  // @ApiResponse({ status: 200 })
  // @UseGuards(AuthGuard('jwt'))
  // @Get(':id')
  // async findOne(@Param('id') id: number, @Req() req): Promise<Userapp> {
  //   // find the apps with this id
  //   const apps = await this.userappService.findOne(id, req.user);

  //   // if the apps doesn't exit in the db, throw a 404 error
  //   if (!apps) {
  //     throw new NotFoundException("This app doesn't exist");
  //   }

  //   // if apps exist, return apps
  //   return apps;
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Post()
  // async create(@Body() userapp: UserappDto, @Request() req): Promise<Userapp> {
  //   // create a new apps and return the newly created apps
  //   return await this.userappService.create(userapp, req.user.id);
  // }

  // @ApiResponse({ status: 200 })
  // @UseGuards(AuthGuard('jwt'))
  // @Put(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() userapp: UserappDto,
  //   @Request() req,
  // ): Promise<Userapp> {
  //   // get the number of row affected and the updated userapp
  //   const {
  //     numberOfAffectedRows,
  //     updatedApplication,
  //   } = await this.userappService.update(id, userapp, req.user);

  //   // if the number of row affected is zero,
  //   // it means the app doesn't exist in our db
  //   if (numberOfAffectedRows === 0) {
  //     throw new NotFoundException("This app doesn't exist");
  //   }

  //   // return the updated app
  //   return updatedApplication;
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Delete(':id')
  // async remove(@Param('id') id: number, @Req() req) {
  //   // delete the app with this id
  //   const deleted = await this.userappService.delete(id, req.user.id);

  //   // if the number of row affected is zero,
  //   // then the app doesn't exist in our db
  //   if (deleted === 0) {
  //     throw new NotFoundException("This app doesn't exist");
  //   }

  //   // return success message
  //   return 'Successfully deleted';
  // }
}