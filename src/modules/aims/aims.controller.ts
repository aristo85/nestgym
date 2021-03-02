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
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Aim } from '../aims/aim.entity';
import { AimsService } from '../aims/aims.service';
import { AimDto } from '../aims/dto/aim.dto';
import { User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { Role } from '../users/dto/user.dto';

@ApiTags('Given Aim/Goal List (Цели)')
@ApiBearerAuth()
@Controller('aims')
export class AimsController {
  constructor(private readonly aimService: AimsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() aim: AimDto, @AuthUser() user: User): Promise<Aim> {
    // check the role
    if (user.role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // create a new aim and return the newly created aim
    return await this.aimService.createAim(aim, user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request & { res: Response }) {
    // get all aims in the db
    const list = await this.aimService.findAllAims();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Aim> {
    // find the aim with this id
    const aim = await this.aimService.findOneAim(id);

    // if the aim doesn't exit in the db, throw a 404 error
    if (!aim) {
      throw new NotFoundException("This Aim doesn't exist");
    }
    // if aim exist, return aim
    return aim;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() aim: AimDto,
    @AuthUser() user: User,
  ): Promise<Aim> {
    // check the role
    if (user.role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // get the number of row affected and the updated aim
    const {
      numberOfAffectedRows,
      updatedAim,
    } = await this.aimService.updateAim(id, aim);

    // if the number of row affected is zero,
    // it means the aim doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This aim doesn't exist");
    }

    // return the updated aim
    return updatedAim;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserRole() role: Role) {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // delete the aim with this id
    const deleted = await this.aimService.deleteAim(id);

    // if the number of row affected is zero,
    // then the aim doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This aim doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
