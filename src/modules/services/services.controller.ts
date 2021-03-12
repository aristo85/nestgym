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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { ServicioDto } from './dto/service.dto';
import { Servicio } from './service.entity';
import { ServicesService } from './services.service';

@ApiTags('Service List (Список услуги)')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) {}

  @ApiOperation({
    summary: 'Создание услуги. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: ServicioDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<Servicio> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // create a new service and return the newly created service
    return await this.serviceService.createService(data, user.id);
  }

  @ApiOperation({
    summary: 'Получение всех услуг',
  })
  @ApiResponse({ status: 200, description: 'Массив услуг' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request & { res: Response }) {
    // get all services in the db
    const list = await this.serviceService.findAllServices();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiOperation({
    summary: 'Получение услуги по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200, description: 'Найденная услуга' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id услуги',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @UserRole() role: Roles,
  ): Promise<Servicio> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // find the service with this id
    const service = await this.serviceService.findOneService(id);

    // if the service doesn't exit in the db, throw a 404 error
    if (!service) {
      throw new NotFoundException("This service doesn't exist");
    }
    // if service exist, return service
    return service;
  }

  @ApiOperation({
    summary: 'Редактирование услуги по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id услуги',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: ServicioDto,
    @UserRole() role: Roles,
  ): Promise<Servicio> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // get the number of row affected and the updated service
    const {
      numberOfAffectedRows,
      updatedServicio,
    } = await this.serviceService.updateService(id, data);

    // if the number of row affected is zero,
    // it means the service doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This service doesn't exist");
    }

    // return the updated service
    return updatedServicio;
  }

  @ApiOperation({
    summary: 'Удаление услуги по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id услуги',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserRole() role: Roles) {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // delete the service with this id
    const deleted = await this.serviceService.deleteService(id);

    // if the number of row affected is zero,
    // then the service doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This service doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
