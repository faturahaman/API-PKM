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
        if (!signInDto.recaptchaToken) {
            throw new UnauthorizedException('Silakan verifikasi reCAPTCHA Anda');
        }

        // Verifikasi reCAPTCHA
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${signInDto.recaptchaToken}`;

        let recaptchaData: { success: boolean };
        try {
            const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
            recaptchaData = await recaptchaRes.json();
        } catch {
            throw new UnauthorizedException('Gagal menghubungi layanan reCAPTCHA');
        }

        if (!recaptchaData.success) {
            throw new UnauthorizedException('Verifikasi reCAPTCHA gagal');
        }

        // Cek admin
        const admin = await this.adminsService.findOneByName(signInDto.name);
        if (!admin) {
            throw new UnauthorizedException('Nama atau Password Salah!');
        }

        // Cek password
        const isPasswordValid = await bcrypt.compare(signInDto.password, admin.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Nama atau Password Salah!');
        }

        const payload: JwtPayload = {
            sub: admin.id,
            name: admin.name,
            level: admin.level,
        };

        const token = await this.jwtService.signAsync(payload);

        await this.adminsService.updateCurrentToken(admin.id, token);
        return {
            access_token: token,
        };
    }
}