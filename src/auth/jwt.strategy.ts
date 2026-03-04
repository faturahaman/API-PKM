import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types/jwt.interface';
import { AdminsService } from 'src/admins/admins.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly adminService: AdminsService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    const admin = await this.adminService.findOne(payload.sub);
    if (!admin) {
      throw new UnauthorizedException('Admin tidak ditemukan.');
    }

    if (admin.current_token !== token) {
      throw new UnauthorizedException('Sesi berakhir karena akun ini telah login di perangkat lain.');
    }

    return admin;
  }
}