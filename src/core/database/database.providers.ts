import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/user.entity';
import { Sequelize } from 'sequelize-typescript';
import { Profile } from 'src/modules/profiles/profile.entity';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Photo } from 'src/modules/photos/photo.entity';
import { CoachProfile } from 'src/modules/coach-modules/coach-profiles/coach-profile.entity';
import { Requestedapp } from 'src/modules/coach-modules/coachapps/coachapp.entity';
import { PhotoProgress } from './DB/dynamics/photoProgress.entity';
import { UserProgress } from './DB/dynamics/userProgress.entity';
import { Feedback } from './DB/feedbacks/feedback.entity';
import { PhotoFeedback } from './DB/feedbacks/photoFeedback.entity';
import { Article } from './DB/publication/article.entity';
import { DailyRateDiet } from './DB/recomendations/dailyRateDiet.entity';
import { DietRecomendation } from './DB/recomendations/dietrecomendation.entity';
import { WorkoutOnDiet } from './DB/recomendations/workoutOnDiet.entity';
import { AppPayment } from './DB/transaction/appPaymetn.entity';
import { CoachPayment } from './DB/transaction/coachPayment.entity';
import { UserTransaction } from './DB/transaction/userTransaction.entity';
// import { Sequelize } from 'sequelize';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
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
        PhotoProgress,
        UserProgress,
        Feedback,
        PhotoFeedback,
        Article,
        DailyRateDiet,
        DietRecomendation,
        WorkoutOnDiet,
        AppPayment,
        CoachPayment,
        UserTransaction,
      ]);
      await sequelize.sync({ alter: true });
      return sequelize;
    },
  },
];
