import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
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
    @Request() req,
  ): Promise<TemplateDiet> {
    // check the role
    if (req.user.role !== 'trainer') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // create a new progs and return the newly created progs
    return await this.templateDietService.create(template, req.user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    // get all progs in the db
    const list = await this.templateDietService.findAll(req.user);
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
    @Request() req,
  ): Promise<TemplateDiet> {
    // find the progs with this id
    const progs = await this.templateDietService.findOne(id, req.user);

    // if the progs doesn't exit in the db, throw a 404 error
    if (!progs) {
      throw new NotFoundException("This program doesn't exist");
    }

    // if progs exist, return progs
    return progs;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    // delete the app with this id
    const deleted = await this.templateDietService.delete(id, req.user.id);

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
    @Request() req,
  ): Promise<TemplateDiet> {
    // get the number of row affected and the updated Prog
    return await this.templateDietService.update(id, data, req.user.id);
  }
}
