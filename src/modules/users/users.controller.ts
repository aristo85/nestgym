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
    Header,
    Headers,
    Res,
    Req,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { ApiResponse, ApiTags } from '@nestjs/swagger';
  import { Response } from 'express';
import { UsersService } from './users.service';
  
  @ApiTags('Application')
  @Controller('users')
  export class UsersController {
    constructor(private readonly userService: UsersService) {}
  
    @ApiResponse({ status: 200 })
    @Get()
    async findAll(@Req() req) {
      // get all apps in the db
      const list = await this.userService.findAll();
      const count = list.length;
    //   req.res.set('x-total-count', `${count}`)
      return list;
    }
  
    // @ApiResponse({ status: 200 })
    // @Get(':id')
    // async findOne(@Param('id') id: number): Promise<Userapp> {
    //   // find the apps with this id
    //   const apps = await this.userappService.findOne(id);
  
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
    // // @UseGuards(AuthGuard('jwt'))
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
    //   } = await this.userappService.update(id, userapp, req.user.id);
  
    //   // if the number of row affected is zero,
    //   // it means the app doesn't exist in our db
    //   if (numberOfAffectedRows === 0) {
    //     throw new NotFoundException("This app doesn't exist");
    //   }
  
    //   // return the updated app
    //   return updatedApplication;
    // }
  
    // // @UseGuards(AuthGuard('jwt'))
    // @Delete(':id')
    // async remove(@Param('id') id: number) {
    //   // delete the app with this id
    //   const deleted = await this.userappService.delete(id);
  
    //   // if the number of row affected is zero,
    //   // then the app doesn't exist in our db
    //   if (deleted === 0) {
    //     throw new NotFoundException("This app doesn't exist");
    //   }
  
    //   // return success message
    //   return 'Successfully deleted';
    // }
  }
  