import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/user.entity';
import { Sequelize } from 'sequelize-typescript';
import { Profile } from 'src/modules/profiles/profile.entity';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Photo } from 'src/modules/photos/photo.entity';
// import { Sequelize } from 'sequelize';

export const databaseProviders = [{
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
        sequelize.addModels([User, Profile, Userapp, Photo]);
        await sequelize.sync();
        return sequelize;
    },
}];