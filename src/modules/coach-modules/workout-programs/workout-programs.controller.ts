import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkoutProgramDto } from './dto/workout-progiam.dto';
import { WorkoutProgram } from './workout-program.entity';
import { WorkoutProgramsService } from './workout-programs.service';

@ApiTags('workout programs')
@ApiBearerAuth()
@Controller('workout-programs')
export class WorkoutProgramsController {
  constructor(private readonly workoutProgramService: WorkoutProgramsService) {}

//   @UseGuards(AuthGuard('jwt'))
//   @Post(':userappId')
//   async create(
//     @Body() workoutprogram: WorkoutProgramDto,
//     @Request() req,
//     @Param('userappId') userappId: number,
//   ): Promise<WorkoutProgram> {
//     // check the role
//     if (req.user.role !== 'trainer') {
//       throw new NotFoundException('Your role is not a trainer');
//     }
//     // create a new apps and return the newly created apps
//     return await this.workoutProgramService.create(
//       workoutprogram,
//       userappId,
//     );
//   }
}
