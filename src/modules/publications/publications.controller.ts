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
import { ArticleDto } from './dto/publication.dto';
import { Article } from './publication.entity';
import { PublicationsService } from './publications.service';
  
  @ApiTags('Publications/Articles')
  @ApiBearerAuth()
  @Controller('publications')
export class PublicationsController {
    constructor(private readonly publicationService: PublicationsService) {}
  
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() data: ArticleDto, @Request() req): Promise<Article> {
      // check the role
      if (req.user.role !== 'admin') {
        throw new NotFoundException('Your role is not an admin');
      }
      // create a new article and return the newly created article
      return await this.publicationService.create(data, req.user.id);
    }
  
    @ApiResponse({ status: 200 })
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(@Req() req) {
      // get all articles in the db
      const list = await this.publicationService.findAll();
      const count = list.length;
      req.res.set('Access-Control-Expose-Headers', 'Content-Range');
      req.res.set('Content-Range', `0-${count}/${count}`);
      return list;
    }
  
    @ApiResponse({ status: 200 })
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req): Promise<Article> {
      // find the article with this id
      const article = await this.publicationService.findOne(id);
  
      // if the article doesn't exit in the db, throw a 404 error
      if (!article) {
        throw new NotFoundException("This article doesn't exist");
      }
      // if article exist, return article
      return article;
    }
  
    @ApiResponse({ status: 200 })
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() data: ArticleDto,
      @Request() req,
    ): Promise<Article> {
        // check the role
      if (req.user.role !== 'admin') {
          throw new NotFoundException('Your role is not an admin');
        }
      // get the number of row affected and the updated article
      const {
        numberOfAffectedRows,
        updatedArticle,
      } = await this.publicationService.update(id, data);
  
      // if the number of row affected is zero,
      // it means the article doesn't exist in our db
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException("This article doesn't exist");
      }
  
      // return the updated article
      return updatedArticle;
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Param('id') id: number, @Req() req) {
        // check the role
      if (req.user.role !== 'admin') {
          throw new NotFoundException('Your role is not an admin');
        }
      // delete the article with this id
      const deleted = await this.publicationService.delete(id);
  
      // if the number of row affected is zero,
      // then the article doesn't exist in our db
      if (deleted === 0) {
        throw new NotFoundException("This article doesn't exist");
      }
  
      // return success message
      return 'Successfully deleted';
    }
  }
  