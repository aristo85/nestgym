import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/user.entity';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Profile } from 'src/modules/profiles/profile.entity';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Photo } from 'src/modules/photos/photo.entity';
import { CoachProfile } from 'src/modules/coach-modules/coach-profiles/coach-profile.entity';
import { Requestedapp } from 'src/modules/coach-modules/coachapps/coachapp.entity';
import { UserProgress } from '../../modules/user-progress/user-progress.entity';
import { Feedback } from '../../modules/feedbacks/feedback.entity';
import { DailyRateDiet } from './DB/recomendations/dailyRateDiet.entity';
import { DietRecomendation } from './DB/recomendations/dietrecomendation.entity';
import { WorkoutOnDiet } from './DB/recomendations/workoutOnDiet.entity';
import { AppPayment } from './DB/transaction/appPaymetn.entity';
import { CoachPayment } from './DB/transaction/coachPayment.entity';
import { UserTransaction } from './DB/transaction/userTransaction.entity';
import { CoachService } from 'src/modules/coach-modules/coach-services/coach-service.entity';
import { DayBook } from './DB/dayBook.entity';
import { FullProgWorkout } from 'src/modules/coach-modules/full-progworkouts/full.progworkout.enity';
import { DietProgram } from 'src/modules/coach-modules/dietprogram/dietprogram.entity';
import { Aim } from 'src/modules/aims/aim.entity';
import { Sport } from 'src/modules/sports/sport.entity';
import { UserWorkout } from 'src/modules/user-workouts/user-workout.entity';
import { TemplateWorkout } from 'src/modules/coach-modules/template-workouts/template-workout.entity';
import { TemplateDiet } from 'src/modules/coach-modules/template-diets/template-diet.entity';
import { Servicio } from 'src/modules/services/service.entity';
import { Article } from 'src/modules/publications/publication.entity';
import { IDatabaseConfigAttributes } from './interfaces/dbConfig.interface';
import { Place } from 'src/modules/places/place.entity';
import { CoachNote } from 'src/modules/coach-modules/coach-noates/coachNote.entity';
import { Diet } from 'src/modules/diets/diet.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config: IDatabaseConfigAttributes | undefined;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        Profile,
        Userapp,
        Photo,
        CoachProfile,
        Requestedapp,
        UserProgress,
        Feedback,
        DailyRateDiet,
        DietRecomendation,
        WorkoutOnDiet,
        AppPayment,
        CoachPayment,
        UserTransaction,
        CoachService,
        DayBook,
        FullProgWorkout,
        DietProgram,
        Aim,
        Sport,
        UserWorkout,
        TemplateWorkout,
        TemplateDiet,
        Servicio,
        Article,
        Place,
        CoachNote,
        Diet,
      ]);
      await sequelize.sync({ alter: true });
      return sequelize;
    },
  },
];
