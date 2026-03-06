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
      console.warn(`[JwtStrategy] Admin not found for ID: ${payload.sub}`);
      throw new UnauthorizedException('Admin tidak ditemukan.');
    }

    if (admin.current_token !== token) {
      console.warn(`[JwtStrategy] Token mismatch for ${admin.name}. Incoming: ${token?.substring(0, 20)}..., DB: ${admin.current_token?.substring(0, 20)}...`);
      throw new UnauthorizedException('Sesi berakhir karena akun ini telah login di perangkat lain.');
    }

    console.log(`[JwtStrategy] Token validated for: ${admin.name}`);
    // Return the full user object with tenant information
    return {
      sub: admin.id,
      name: admin.name,
      role: admin.role,
      puskesmas_id: admin.puskesmas_id,
      active_tenant: payload.active_tenant,
    };
  }
}
