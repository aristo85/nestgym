import { Inject, Injectable } from '@nestjs/common';
import { FAQ_REPOSITORY } from 'src/core/constants';
import { FAQDto } from './dto/faq.dto';
import { FAQ } from './faq.entity';

@Injectable()
export class FaqService {
  constructor(
    @Inject(FAQ_REPOSITORY)
    private readonly faqRepository: typeof FAQ,
  ) {}

  async createFAQ(data: FAQDto, adminId: number): Promise<FAQ> {
    return await this.faqRepository.create<FAQ>({
      ...data,
      adminId,
    });
  }

  async findAllFAQs(): Promise<FAQ[]> {
    return await this.faqRepository.findAll<FAQ>({});
  }

  async findOneFAQ(FAQId: number): Promise<FAQ> {
    return await this.faqRepository.findOne({
      where: { id: FAQId },
    });
  }

  async deleteFAQ(FAQId: number) {
    return await this.faqRepository.destroy({
      where: { id: FAQId },
    });
  }

  async updateFAQ(FAQId: number, data: FAQDto) {
    const [
      numberOfAffectedRows,
      [updatedFAQ],
    ] = await this.faqRepository.update(
      { ...data },
      { where: { id: FAQId }, returning: true },
    );

    return { numberOfAffectedRows, updatedFAQ };
  }
}
