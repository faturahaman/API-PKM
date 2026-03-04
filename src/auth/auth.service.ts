import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/admins/dto/create-user.dto';
import { JwtPayload } from 'src/types/jwt.interface';
import { RecaptchaService } from 'src/common/recaptcha/recaptcha.service';

@Injectable()
export class AuthService {
    constructor(
        private adminsService: AdminsService,
        private jwtService: JwtService,
        private recaptchaService: RecaptchaService,
    ) { }

    async signIn(signInDto: CreateUserDto) {
        await this.recaptchaService.verify(signInDto.recaptchaToken);

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