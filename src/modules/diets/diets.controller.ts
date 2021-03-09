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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { Diet } from './diet.entity';
import { DietsService } from './diets.service';
import { DietDto } from './dto/diet.dto';

@ApiTags('Given Diet List (Виды диета)')
@ApiBearerAuth()
@Controller('diets')
export class DietsController {
  constructor(private readonly dietService: DietsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: DietDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<Diet> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // create a new diet and return the newly created diet
    return await this.dietService.createDiet(data, user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request & { res: Response }) {
    // get all diets in the db
    const list = await this.dietService.findAllDiets();
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
    @UserRole() role: Roles,
  ): Promise<Diet> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // find the diet with this id
    const diet = await this.dietService.findOneDiet(id);

    // if the diet doesn't exit in the db, throw a 404 error
    if (!diet) {
      throw new NotFoundException("This diet doesn't exist");
    }
    // if diet exist, return diet
    return diet;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() diet: DietDto,
    @UserRole() role: Roles,
  ): Promise<Diet> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // get the number of row affected and the updated diet
    const {
      numberOfAffectedRows,
      updatedDiet,
    } = await this.dietService.updateDiet(id, diet);

    // if the number of row affected is zero,
    // it means the diet doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This diet doesn't exist");
    }

    // return the updated diet
    return updatedDiet;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserRole() role: Roles) {
    // check the role
    if (role !== 'admin') {
      throw new NotFoundException('Your role is not an admin');
    }
    // delete the diet with this id
    const deleted = await this.dietService.deleteDiet(id);

    // if the number of row affected is zero,
    // then the diet doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This diet doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
