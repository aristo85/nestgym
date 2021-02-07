import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Profile } from 'src/modules/profiles/profile.entity';
import { UserProgress } from 'src/modules/user-progress/user-progress.entity';
import { User } from 'src/modules/users/user.entity';
import { Requestedapp } from '../coachapps/coachapp.entity';
import { CoachProgressService } from './coach-progress.service';

@ApiTags('Coach reads his clients progress')
@ApiBearerAuth()
@Controller('coach-progress')
export class CoachProgressController {
  constructor(private readonly coachProgressService: CoachProgressService) {}

  // request to hire a Trainer
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  async findOne(@Req() req, @Param('userId') userId): Promise<User> {
    // check the role
    if (req.user.role === 'user') {
      throw new NotFoundException(
        "your role is 'user', users dont have access to coaches info.! ",
      );
    }
    const progress = await User.findOne({
      where: { id: userId },
      include: [Profile, UserProgress],
      attributes: [],
    });
    if (!progress) {
      throw new NotFoundException('insert a correct clientID');
    }

    return progress;
  }

  // get all my clients progress of a triner
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req) {
    // check the role
    if (req.user.role === 'user') {
      throw new NotFoundException(
        "your role is 'user', users dont have access to coaches info.! ",
      );
    }
    // get all requested apps in the db
    let myClietnIds = [];
    const requestList = await Requestedapp.findAll<Requestedapp>({
      where: { coachId: req.user.id },
    });
    requestList.forEach((app) => {
      myClietnIds.push(app.userId);
    });
    // get all my clients progress and profile exclude fields of registration
    const myProgs = await User.findAll({
      where: {
        id: [...myClietnIds],
      },
      include: [Profile, UserProgress],
      attributes: [],
    });
    const count = myProgs.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return myProgs;
  }
}
