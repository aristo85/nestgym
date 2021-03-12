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
import { ArticleDto } from './dto/publication.dto';
import { Article } from './publication.entity';
import { PublicationsService } from './publications.service';

@ApiTags('Publications/Articles (Статьи)')
@ApiBearerAuth()
@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationService: PublicationsService) {}

  @ApiOperation({
    summary: 'Создание статьи. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: ArticleDto,
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ): Promise<Article> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // create a new article and return the newly created article
    return await this.publicationService.createArticle(data, user.id);
  }

  @ApiOperation({
    summary: 'Получение всех статей',
  })
  @ApiResponse({ status: 200, description: 'Массив статей' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request & { res: Response }) {
    // get all articles in the db
    const list = await this.publicationService.findAllArticles();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiOperation({
    summary: 'Получение статьи по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200, description: 'Найденная статья' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id статьи',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Article> {
    // find the article with this id
    const article = await this.publicationService.findOneArticle(id);

    // if the article doesn't exit in the db, throw a 404 error
    if (!article) {
      throw new NotFoundException("This article doesn't exist");
    }
    // if article exist, return article
    return article;
  }

  @ApiOperation({
    summary: 'Редактирование статьи по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id стстьи',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: ArticleDto,
    @UserRole() role: Roles,
  ): Promise<Article> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // get the number of row affected and the updated article
    const {
      numberOfAffectedRows,
      updatedArticle,
    } = await this.publicationService.updateArticle(id, data);

    // if the number of row affected is zero,
    // it means the article doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This article doesn't exist");
    }

    // return the updated article
    return updatedArticle;
  }

  @ApiOperation({
    summary: 'Удаление статьи по id. АДМИН',
    description: 'Только пользователи с ролью Admin',
  })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id стстьи',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserRole() role: Roles) {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // delete the article with this id
    const deleted = await this.publicationService.deleteArticle(id);

    // if the number of row affected is zero,
    // then the article doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This article doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
