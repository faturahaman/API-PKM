import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/admins/dto/create-user.dto';
import { JwtPayload } from 'src/types/jwt.interface';

@Injectable()
export class AuthService {
    constructor(
        private adminsService: AdminsService,
        private jwtService: JwtService,
    ) { }

    async signIn(signInDto: CreateUserDto) {
        // verify recaptcha
        if (!signInDto.recaptchaToken) {
            throw new UnauthorizedException('Silakan verifikasi reCAPTCHA Anda');
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${signInDto.recaptchaToken}`;

        try {
            const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
            const recaptchaData = await recaptchaRes.json();

            if (!recaptchaData.success) {
                throw new UnauthorizedException('Verifikasi reCAPTCHA gagal');
            }
        } catch (error) {
            throw new UnauthorizedException('Gagal memverifikasi reCAPTCHA');
        }

        // cek admin
        const admin = await this.adminsService.findOneByName(signInDto.name);
        if (!admin) {
            throw new UnauthorizedException('Nama atau Password Salah!');
        }

        // cek password
        const isPasswordValid = await bcrypt.compare(signInDto.password, admin.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Nama atau Password Salah!');
        }

        // buat token
        const payload: JwtPayload = {
            sub: admin.id,
            name: admin.name,
            level: admin.level
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}
