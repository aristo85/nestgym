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
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
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
      req.res.set('Access-Control-Expose-Headers', 'Content-Range')
      req.res.set('Content-Range', `0-${count}/${count}`)
      return list;
    }
  
    @ApiResponse({ status: 200 })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    // find the users with this id
    const user = await this.userService.findOne(id);

    // if the users doesn't exit in the db, throw a 404 error
    if (!user) {
      throw new NotFoundException("This app doesn't exist");
    }

    // if users exist, return users
    return user;
  }
    // @UseGuards(AuthGuard('jwt'))
    // @Post()
    // async create(@Body() user: UserDto): Promise<User> {
    //   // create a new users and return the newly created users
    //   return await this.userService.create(user);
    // }
  
    @ApiResponse({ status: 200 })
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() user,
      @Request() req,
    ): Promise<User> {
      // get the number of row affected and the updated user
      const {
        numberOfAffectedRows,
        updatedApplication,
      } = await this.userService.update(id, user);
  
      // if the number of row affected is zero,
      // it means the app doesn't exist in our db
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException("This app doesn't exist");
      }
  
      // return the updated app
      return updatedApplication;
    }
  
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
  