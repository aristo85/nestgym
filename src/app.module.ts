import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { UserappsModule } from './modules/userapps/userapps.module';
import { PhotosModule } from './modules/photos/photos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    UserappsModule,
    PhotosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
