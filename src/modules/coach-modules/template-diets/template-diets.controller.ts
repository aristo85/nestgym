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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles, User } from 'src/modules/users/user.entity';
import { AuthUser, UserRole } from 'src/modules/users/users.decorator';
import {
  RetTemplate,
  TemplateDietDto,
  TemplateDietUpdateDto,
} from './dto/template-diet.dto';
import { TemplateDiet } from './template-diet.entity';
import { TemplateDietsService } from './template-diets.service';

@ApiTags('Template Diet Programs')
@ApiBearerAuth()
@Controller('template-diets')
export class TemplateDietsController {
  constructor(private readonly templateDietService: TemplateDietsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() template: TemplateDietDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<TemplateDiet> {
    // check the role
    if (role !== 'trainer') {
      throw new ForbiddenException('Your role is not a trainer');
    }
    // create a new progs and return the newly created progs
    return await this.templateDietService.createDietTemplate(template, user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { res: Response },
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // get all progs in the db
    const list = await this.templateDietService.findAllDietTemplates(
      role === 'admin' ? null : user.id,
    );
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<RetTemplate> {
    // check the role
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // find the progs with this id
    const progs = await this.templateDietService.findOneDietTemplate(
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
    @Param('id') id: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // delete the app with this id
    const deleted = await this.templateDietService.deleteDietTemplate(
      id,
      role === 'admin' ? null : user.id,
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
    @Body() data: TemplateDietUpdateDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<TemplateDiet[]> {
    // check the role
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // check id
    const prog = await this.templateDietService.findOneDietTemplate(
      id,
      role === 'admin' ? undefined : user.id,
    );
    if (!prog) {
      throw new NotFoundException("This program doesn't exist");
    }
    // get the number of row affected and the updated Prog
    return await this.templateDietService.updateDietTemplate(
      id,
      data,
      role === 'admin' ? undefined : user.id,
    );
  }
}
