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
import { FAQDto } from './dto/faq.dto';
import { FAQ } from './faq.entity';
import { FaqService } from './faq.service';

@ApiTags('FAQ')
@ApiBearerAuth()
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @ApiOperation({
    summary: 'Создание FAQ. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: FAQDto,
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ): Promise<FAQ> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // create a new faq and return the newly created faq
    return await this.faqService.createFAQ(data, user.id);
  }

  @ApiOperation({
    summary: 'Получение всех FAQ',
  })
  @ApiResponse({ status: 200, description: 'Массив FAQ' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request & { res: Response }) {
    // get all faqs in the db
    const list = await this.faqService.findAllFAQs();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiOperation({
    summary: 'Получение FAQ по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200, description: 'Найденный FAQ' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id FAQ',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<FAQ> {
    // find the faq with this id
    const faq = await this.faqService.findOneFAQ(id);

    // if the faq doesn't exit in the db, throw a 404 error
    if (!faq) {
      throw new NotFoundException("This faq doesn't exist");
    }
    // if faq exist, return faq
    return faq;
  }

  @ApiOperation({
    summary: 'Редактирование FAQ по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id faq',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: FAQDto,
    @UserRole() role: Roles,
  ): Promise<FAQ> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // get the number of row affected and the updated faq
    const {
      numberOfAffectedRows,
      updatedFAQ,
    } = await this.faqService.updateFAQ(id, data);

    // if the number of row affected is zero,
    // it means the faq doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This faq doesn't exist");
    }

    // return the updated faq
    return updatedFAQ;
  }

  @ApiOperation({
    summary: 'Удаление FAQ по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id faq',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserRole() role: Roles) {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // delete the faq with this id
    const deleted = await this.faqService.deleteFAQ(id);

    // if the number of row affected is zero,
    // then the faq doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This faq doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
