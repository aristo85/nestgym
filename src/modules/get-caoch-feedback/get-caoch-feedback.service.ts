import { Inject, Injectable } from '@nestjs/common';
import { sendFeedbackEmail } from 'src/core/config/nodemailer.config';
import { User } from '../users/user.entity';
import { GCFeedbackDto } from './dto/get-caoch-feedback.dto';

@Injectable()
export class GetCaochFeedbackService {
  constructor() {}

  async sendFeedback(data: GCFeedbackDto, user: User) {
    sendFeedbackEmail(user.email, data.title, data.text);
    return 'createdFeedback';
  }

  /////////////////////////////////////////////
}
