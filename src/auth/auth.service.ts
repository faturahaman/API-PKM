import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private adminsService: AdminsService,
        private jwtService: JwtService,
    ) {}

    async signIn(name: string, password: string){
        const admin = await this.adminsService.findOneByName(name);

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            throw new UnauthorizedException('Nama atau Password Salah!');
        }

        const payload = { 
            sub: admin._id, 
            username: admin.name, 
            level: (admin as any).level 
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
