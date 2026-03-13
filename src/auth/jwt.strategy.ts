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
      console.warn(`[JwtStrategy] Admin not found for ID`);
      throw new UnauthorizedException('Admin tidak ditemukan.');
    }

    // Validate token version for session security
    if (payload.tokenVersion !== admin.token_version) {
      console.warn(`[JwtStrategy] Token version mismatch - session invalidation`);
      throw new UnauthorizedException('Sesi berakhir karena akun ini telah login di perangkat lain.');
    }

    // Check if token is valid - simple comparison
    if (admin.current_token && token && admin.current_token !== token) {
      console.warn(`[JwtStrategy] Token mismatch - session invalidation`);
      throw new UnauthorizedException('Sesi berakhir karena akun ini telah login di perangkat lain.');
    }

    console.log(`[JwtStrategy] Token validated`);
    // Return the full user object with tenant information
    return {
      id: admin.id,
      sub: admin.id,
      name: admin.name,
      photo: admin.photo,
      role: admin.role,
      puskesmas_id: admin.puskesmas_id,
      active_tenant: payload.active_tenant,
      tokenVersion: payload.tokenVersion,
    };
  }
}
