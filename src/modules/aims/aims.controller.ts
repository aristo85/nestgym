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
  import { Aim } from '../aims/aim.entity';
  import { AimsService } from '../aims/aims.service';
  import { AimDto } from '../aims/dto/aim.dto';

@ApiTags('Given Aim/Goal List')
@ApiBearerAuth()
@Controller('aims')
export class AimsController {
    constructor(private readonly aimService: AimsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() aim: AimDto, @Request() req): Promise<Aim> {
    // check the role
    if (req.user.role !== 'admin') {
      throw new NotFoundException('Your role is not an admin');
    }
    // create a new aim and return the newly created aim
    return await this.aimService.create(aim, req.user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req) {
    // get all aims in the db
    const list = await this.aimService.findAll();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req): Promise<Aim> {
    // find the aim with this id
    const aim = await this.aimService.findOne(id);

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
    @Request() req,
  ): Promise<Aim> {
      // check the role
    if (req.user.role !== 'admin') {
        throw new NotFoundException('Your role is not an admin');
      }
    // get the number of row affected and the updated aim
    const { numberOfAffectedRows, updatedAim } = await this.aimService.update(
      id,
      aim,
    );

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
  async remove(@Param('id') id: number, @Req() req) {
      // check the role
    if (req.user.role !== 'admin') {
        throw new NotFoundException('Your role is not an admin');
      }
    // delete the aim with this id
    const deleted = await this.aimService.delete(id);

    // if the number of row affected is zero,
    // then the aim doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This aim doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
