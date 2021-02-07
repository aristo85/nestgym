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
import { ServicioDto } from './dto/service.dto';
import { Servicio } from './service.entity';
import { ServicesService } from './services.service';
  
  @ApiTags('Service List')
  @ApiBearerAuth()
  @Controller('services')
export class ServicesController {
    constructor(private readonly serviceService: ServicesService) {}
  
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() data: ServicioDto, @Request() req): Promise<Servicio> {
      // check the role
      if (req.user.role !== 'admin') {
        throw new NotFoundException('Your role is not an admin');
      }
      // create a new service and return the newly created service
      return await this.serviceService.create(data, req.user.id);
    }
  
    @ApiResponse({ status: 200 })
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(@Req() req) {
      // get all services in the db
      const list = await this.serviceService.findAll();
      const count = list.length;
      req.res.set('Access-Control-Expose-Headers', 'Content-Range');
      req.res.set('Content-Range', `0-${count}/${count}`);
      return list;
    }
  
    @ApiResponse({ status: 200 })
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req): Promise<Servicio> {
      // find the service with this id
      const service = await this.serviceService.findOne(id);
  
      // if the service doesn't exit in the db, throw a 404 error
      if (!service) {
        throw new NotFoundException("This service doesn't exist");
      }
      // if service exist, return service
      return service;
    }
  
    @ApiResponse({ status: 200 })
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() data: ServicioDto,
      @Request() req,
    ): Promise<Servicio> {
        // check the role
      if (req.user.role !== 'admin') {
          throw new NotFoundException('Your role is not an admin');
        }
      // get the number of row affected and the updated service
      const {
        numberOfAffectedRows,
        updatedServicio,
      } = await this.serviceService.update(id, data);
  
      // if the number of row affected is zero,
      // it means the service doesn't exist in our db
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException("This service doesn't exist");
      }
  
      // return the updated service
      return updatedServicio;
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Param('id') id: number, @Req() req) {
        // check the role
      if (req.user.role !== 'admin') {
          throw new NotFoundException('Your role is not an admin');
        }
      // delete the service with this id
      const deleted = await this.serviceService.delete(id);
  
      // if the number of row affected is zero,
      // then the service doesn't exist in our db
      if (deleted === 0) {
        throw new NotFoundException("This service doesn't exist");
      }
  
      // return success message
      return 'Successfully deleted';
    }
  }
  