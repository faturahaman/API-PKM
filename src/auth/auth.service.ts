import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/user.dto';
import { JwtPayload } from 'src/types/jwt.interface';

@Injectable()
export class AuthService {
    constructor(
        private adminsService: AdminsService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInDto: CreateUserDto){

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
            sub: admin._id.toString(), 
            name: admin.name, 
            level: admin.level 
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}
