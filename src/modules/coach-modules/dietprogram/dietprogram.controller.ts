import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles, User } from 'src/modules/users/user.entity';
import { AuthUser, UserRole } from 'src/modules/users/users.decorator';
import { Requestedapp } from '../coachapps/coachapp.entity';
import { RetTemplate } from '../template-diets/dto/template-diet.dto';
import { DietProgram } from './dietprogram.entity';
import { DietprogramService } from './dietprogram.service';
import { DietProgramDto, DietProgramUpdateDto } from './dto/dietprogram.dto';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Role } from 'src/modules/users/dto/user.dto';

@ApiTags('diet programs (Программы диет, созданые тренером)')
@ApiBearerAuth()
@Controller('dietprogram')
export class DietprogramController {
  constructor(private readonly dietProgramService: DietprogramService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: DietProgramDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<DietProgram[]> {
    // check the role
    if (role !== 'trainer') {
      throw new ForbiddenException('Your role is not a trainer');
    }
    // check if the userappIds list is empty
    if (data.userappIds.length < 1) {
      throw new NotFoundException('You havent chosen any application');
    }
    // check if applications are exists
    const myRequests = await Userapp.findAll({
      where: { id: data.userappIds, coachId: user.id },
    });
    if (myRequests.length !== data.userappIds.length) {
      throw new NotFoundException('some of the Apps are not exist');
    }

    // create a new prog and return the newly created progs
    const result = await this.dietProgramService.createDietProgram(
      data,
      user.id,
      myRequests,
    );
    return result;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @AuthUser() user: User,
    @Request() req: Request & { res: Response },
    @UserRole() role: Role,
  ) {
    if (role !== 'trainer') {
      throw new ForbiddenException('User must be trainer');
    }
    // get all progs in the db
    const list = await this.dietProgramService.findAllDietProgramms(user.id);
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @AuthUser() user: User,
    @Param('id') id: number,
    @UserRole() role: Role,
  ): Promise<DietProgram> {
    // find the progs with this id
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    const progs = await this.dietProgramService.findOneDietProgram(
      id,
      role === 'admin' ? null : user.id,
    );

    // if the progs doesn't exit in the db, throw a 404 error
    if (!progs) {
      throw new NotFoundException("This program doesn't exist");
    }

    // if progs exist, return progs
    return progs;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @AuthUser() user: User,
    @Param('id') id: number,
    @UserRole() role: Role,
  ) {
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // delete the app with this id
    const deleted = await this.dietProgramService.deleteDietProgram(
      id,
      role === 'admin' ? undefined : user.id,
    );

    // if the number of row affected is zero,
    // then the app doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This app doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: DietProgramUpdateDto,
    @AuthUser() user: User,
    @UserRole() role: Role,
  ): Promise<DietProgram[]> {
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // check id
    const prog = await this.dietProgramService.findOneDietProgram(
      id,
      role === 'admin' ? undefined : user.id,
    );
    if (!prog) {
      throw new NotFoundException("This program doesn't exist");
    }
    // get the number of row affected and the updated Prog
    return await this.dietProgramService.updateDietProgram(
      id,
      data,
      role === 'admin' ? undefined : user.id,
    );
  }
}
