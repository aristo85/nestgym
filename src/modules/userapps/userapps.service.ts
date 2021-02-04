import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { APPLICATION_REPOSITORY } from 'src/core/constants';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { CoachService } from '../coach-modules/coach-services/coach-service.entity';
import { Requestedapp } from '../coach-modules/coachapps/coachapp.entity';
import { DietProduct } from '../coach-modules/dietproducts/dietproduct.entity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { WorkoutProgram } from '../coach-modules/workout-programs/workout-program.entity';
import { UserWorkout } from '../user-workouts/user-workout.entity';
import { UserappDto } from './userapp.dto';
import { Userapp } from './userapp.entity';

export interface createPromise {
  createdUserapp: UserappDto;
  matches: CoachProfile[];
}

@Injectable()
export class UserappsService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly userappRepository: typeof Userapp,
  ) {}

  async create(userapp: UserappDto, userId): Promise<createPromise> {
    const createdUserapp = await this.userappRepository.create<Userapp>({
      ...userapp,
      userId,
    });
    let matches: CoachProfile[] = await this.coachMatches(createdUserapp);
    return { createdUserapp, matches };
  }

  async findAll(user): Promise<Userapp[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    const list = await this.userappRepository.findAll<Userapp>({
      where: updateOPtion,
      include: [
        Requestedapp,
        {
          model: FullProgWorkout,
          include: [{ model: WorkoutProgram }],
        },
        { model: DietProgram, include: [DietProduct] },
        UserWorkout,
      ],
    });
    return list;
  }

  async findOne(id, user): Promise<Userapp> {
    // check the role
    let updateOPtion = user.role === 'user' ? { id, userId: user.id } : { id };
    return await this.userappRepository.findOne({
      where: updateOPtion,
      include: [
        Requestedapp,
        {
          model: FullProgWorkout,
          include: [{ model: WorkoutProgram }],
        },
        { model: DietProgram, include: [DietProduct] },
        UserWorkout,
      ],
    });
  }

  async delete(id, user) {
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };
    return await this.userappRepository.destroy({ where: updateOPtion });
  }

  async update(id, data, user) {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };

    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.userappRepository.update(
      { ...data },
      { where: updateOPtion, returning: true },
    );

    let matches: CoachProfile[] = await this.coachMatches({ ...data });

    return { numberOfAffectedRows, updatedApplication, matches };
  }

  async findMatches(userappId) {
    // const list = await this.coachProfileRepository.findAll();
    const application: any = await Userapp.findOne({
      where: { id: userappId },
    });
    // filtering with application parametters
    const list = this.coachMatches(application);
    return list;
  }

  // async findAllForAdmin(): Promise<Userapp[]> {
  //   const list = await this.userappRepository.findAll<Userapp>({});
  //   return list;
  // }

  //////////////////////////////////////////////////////////////////////////
  // matching function
  coachMatches = async (userapp: UserappDto): Promise<CoachProfile[]> => {
    if (!userapp) {
      throw new NotFoundException('this profile is not exist');
    }
    const coachProfiles: any = await CoachProfile.findAll<CoachProfile>({
      include: [CoachService],
    });
    let newList = [];
    coachProfiles.forEach((coachProfile) => {
      // const test = this.arrFilter(coachProfile.aim, ['fixing', '6']);
      if (this.arrFilter(coachProfile.aim, userapp.aim).length > 0) {
        newList.push(coachProfile);
      } else if (
        this.arrFilter(coachProfile.sportTypes, userapp.sportTypes).length > 0
      ) {
        newList.push(coachProfile);
      } else if (this.arrFilter(coachProfile.place, userapp.place).length > 0) {
        newList.push(coachProfile);
      } else if (
        this.arrFilter(coachProfile.serviceTypes, userapp.serviceTypes).length >
        0
      ) {
        newList.push(coachProfile);
      }
    });
    return newList.length > 0 ? newList : coachProfiles;
  };
  // filter array function
  arrFilter = (arr1: string[], arr2: string[]) => {
    return arr1.filter((el) => arr2.includes(el));
  };
}
