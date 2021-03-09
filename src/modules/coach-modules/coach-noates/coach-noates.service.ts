import { Inject, Injectable } from '@nestjs/common';
import { COACH_NOTE_REPOSITORY } from 'src/core/constants';
import { CoachNote } from './coachNote.entity';
import { CoachNoteDto } from './dto/coachNote.dto';

@Injectable()
export class CoachNoatesService {
  constructor(
    @Inject(COACH_NOTE_REPOSITORY)
    private readonly coachNoteRepository: typeof CoachNote,
  ) {}

  async createCoachNote(
    data: CoachNoteDto,
    coachId: number,
  ): Promise<CoachNote> {
    const { userappId, note } = data;
    const foundNote = await this.coachNoteRepository.findOne({
      where: { userappId, coachId },
    });

    if (!foundNote) {
      return await this.coachNoteRepository.create({
        ...data,
        coachId,
      });
    }
    const [
      numberOfAffectedRows,
      [updatedCoachNote],
    ] = await this.coachNoteRepository.update(
      { note },
      { where: { userappId, coachId }, returning: true },
    );
    return updatedCoachNote;
  }
}
