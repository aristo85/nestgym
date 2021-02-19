import { Inject, Injectable } from '@nestjs/common';
import { PUBLICATION_REPOSITORY } from 'src/core/constants';
import { ArticleDto } from './dto/publication.dto';
import { Article } from './publication.entity';

@Injectable()
export class PublicationsService {
  constructor(
    @Inject(PUBLICATION_REPOSITORY)
    private readonly publicationRepository: typeof Article,
  ) {}

  async createArticle(data: ArticleDto, adminId: number): Promise<Article> {
    return await this.publicationRepository.create<Article>({
      ...data,
      adminId,
    });
  }

  async findAllArticles(): Promise<Article[]> {
    return await this.publicationRepository.findAll<Article>({});
  }

  async findOneArticle(articleId: number): Promise<Article> {
    return await this.publicationRepository.findOne({
      where: { id: articleId },
    });
  }

  async deleteArticle(articleId: number) {
    return await this.publicationRepository.destroy({
      where: { id: articleId },
    });
  }

  async updateArticle(articleId: number, data: ArticleDto) {
    const [
      numberOfAffectedRows,
      [updatedArticle],
    ] = await this.publicationRepository.update(
      { ...data },
      { where: { id: articleId }, returning: true },
    );

    return { numberOfAffectedRows, updatedArticle };
  }
}
