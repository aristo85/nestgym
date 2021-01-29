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
    
      async create(data: ArticleDto, adminId): Promise<Article> {
        return await this.publicationRepository.create<Article>({
          ...data,
          adminId,
        });
      }
    
      async findAll(): Promise<Article[]> {
        return await this.publicationRepository.findAll<Article>({});
      }
    
      async findOne(id): Promise<Article> {
        return await this.publicationRepository.findOne({
          where: { id },
        });
      }
    
      async delete(id) {
        return await this.publicationRepository.destroy({ where: { id } });
      }
    
      async update(id, data) {
        const [
          numberOfAffectedRows,
          [updatedArticle],
        ] = await this.publicationRepository.update(
          { ...data },
          { where: { id }, returning: true },
        );
    
        return { numberOfAffectedRows, updatedArticle };
      }
}
