import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
    imports: [
        PassportModule,
        UsersModule,
        ProfilesModule,
        JwtModule.register({
            secret: process.env.JWTSECRET,
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule { }