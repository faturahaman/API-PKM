import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminsModule } from '../admins/admins.module';
import { JwtStrategy } from './jwt.strategy';
import { PuskesmasModule } from '../puskesmas/puskesmas.module';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
  imports: [
    AdminsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '8h' },
      }),
    }),
    PuskesmasModule,
    LogactivityModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
