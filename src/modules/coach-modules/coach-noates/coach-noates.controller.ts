import {
  Controller,
  Post,
  Body,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Roles, User } from 'src/modules/users/user.entity';
import { AuthUser, UserRole } from 'src/modules/users/users.decorator';
import { CoachNoatesService } from './coach-noates.service';
import { CoachNote } from './coachNote.entity';
import { CoachNoteDto } from './dto/coachNote.dto';

@ApiTags('CoachNote (Заметки тренера)')
@ApiBearerAuth()
@Controller('coach-noates')
export class CoachNoatesController {
  constructor(private readonly coachNoteService: CoachNoatesService) {}

  @ApiOperation({ summary: 'Создание заметки' })
  @ApiResponse({ status: 201 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: CoachNoteDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<CoachNote> {
    // check the role
    if (role !== 'trainer') {
      throw new ForbiddenException('Your role is not a trainer');
    }

    //   check userapp
    const app = await Userapp.findOne({
      where: { id: data.userappId, coachId: user.id },
    });
    if (!app) {
      throw new NotFoundException('this app not found');
    }

    // create a new Note and return the newly created Note
    return await this.coachNoteService.createCoachNote(data, user.id);
  }

  //   //   test
  //   @Get()
  //   async findall() {
  //     return await CoachNote.findAll({});
  //   }
  //   @Delete(':id')
  //   async delete(@Param('id') id: number) {
  //     return await CoachNote.destroy({ where: { id } });
  //   }
}
