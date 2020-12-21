import { Sequelize } from 'sequelize-typescript';
import { CoachApplication } from 'src/coach-aplication/coach-aplication.entity';
import { Profile } from 'src/profile/profile.entity';
import { User } from '../user/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'postgres',
        password: 'aristo',
        database: 'fullstack_db',
        // models: [User, Profile]
      });

      /**
       * Add Models Here
       * ===============
       * You can add the models to
       * Sequelize later on.
       */
      sequelize.addModels([User, Profile, CoachApplication]);

      await sequelize.sync();
      return sequelize;
    },
  },
];
