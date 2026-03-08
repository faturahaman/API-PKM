import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/admins/dto/create-user.dto';
import { JwtPayload } from 'src/types/jwt.interface';
import { RecaptchaService } from 'src/common/recaptcha/recaptcha.service';
import { AdminRole } from 'src/admins/entity/admin.entity';
import { SwitchTenantDto } from './dto/switch-tenant.dto';
import { PuskesmasService } from 'src/puskesmas/puskesmas.service';
import { PuskesmasStatus } from 'src/puskesmas/entity/puskesmas.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private adminsService: AdminsService,
        private jwtService: JwtService,
        private recaptchaService: RecaptchaService,
        private puskesmasService: PuskesmasService,
    ) { }

    async signIn(signInDto: CreateUserDto) {
        this.logger.log(`Attempting signIn for: ${signInDto.name}`);

        // Validate recaptcha token exists
        if (!signInDto.recaptchaToken) {
            throw new UnauthorizedException('Recaptcha token required');
        }

        try {
            await this.recaptchaService.verify(signInDto.recaptchaToken);
            this.logger.log(`reCAPTCHA verified for: ${signInDto.name}`);
        } catch (e) {
            this.logger.error(`reCAPTCHA FAILED for: ${signInDto.name}`, e.message);
            throw e;
        }

        const admin = await this.adminsService.findOneByName(signInDto.name);
        if (!admin) {
            this.logger.warn(`Admin not found: ${signInDto.name}`);
            throw new UnauthorizedException('Nama atau Password Salah!');
        }
        this.logger.log(`Admin found: ${admin.name}, role: ${admin.role}, puskesmas_id: ${admin.puskesmas_id}`);

        const isPasswordValid = await bcrypt.compare(signInDto.password, admin.password);
        if (!isPasswordValid) {
            this.logger.warn(`Invalid password for: ${signInDto.name}`);
            throw new UnauthorizedException('Nama atau Password Salah!');
        }
        this.logger.log(`Password valid for: ${signInDto.name}`);

        const payload: JwtPayload = {
            sub: admin.id,
            name: admin.name,
            role: admin.role,
            puskesmas_id: admin.puskesmas_id,
        };

        if (admin.role === AdminRole.SUPER_ADMIN) {
            this.logger.log(`Processing SUPER_ADMIN login`);
        } else {
            this.logger.log(`Processing OPERATOR login for PKM: ${admin.puskesmas_id}`);
            if (!admin.puskesmas_id) {
                this.logger.error(`ERROR: Operator ${admin.name} has NO puskesmas_id`);
                throw new UnauthorizedException('Operator belum memiliki puskesmas yang ditugaskan.');
            }

            // Validate that the operator's puskesmas is ACTIVE
            const puskesmas = await this.puskesmasService.findOne(admin.puskesmas_id);
            if (!puskesmas) {
                this.logger.error(`ERROR: Puskesmas not found for operator ${admin.name}`);
                throw new UnauthorizedException('Puskesmas tidak ditemukan.');
            }

            if (puskesmas.status !== PuskesmasStatus.ACTIVE) {
                this.logger.warn(`Operator ${admin.name} trying to login to SUSPENDED/Inactive puskesmas: ${puskesmas.name}`);
                throw new ForbiddenException(
                    `Puskesmas "${puskesmas.name}" sedang tidak aktif. Silakan hubungi administrator.`
                );
            }
        }

        const token = await this.jwtService.signAsync(payload);
        this.logger.log(`JWT signed for: ${signInDto.name}`);

        await this.adminsService.updateCurrentToken(admin.id, token);
        this.logger.log(`current_token updated in DB for: ${signInDto.name}`);

        return {
            access_token: token,
            user: {
                id: admin.id,
                name: admin.name,
                role: admin.role,
                puskesmas_id: admin.puskesmas_id,
            },
        };
    }

    async switchTenant(user: JwtPayload, switchTenantDto: SwitchTenantDto) {
        // Only SUPER_ADMIN can switch tenants
        if (user.role !== AdminRole.SUPER_ADMIN) {
            throw new ForbiddenException('Hanya Super Admin yang dapat Switch tenant.');
        }

        // If tenant_id is null or 'all', reset to global view (no active tenant)
        if (!switchTenantDto.tenant_id || switchTenantDto.tenant_id === 'all') {
            const payload: JwtPayload = {
                sub: user.sub,
                name: user.name,
                role: user.role,
                puskesmas_id: user.puskesmas_id,
                active_tenant: undefined, // Clear active tenant for global view
            };

            const token = await this.jwtService.signAsync(payload);
            await this.adminsService.updateCurrentToken(user.sub, token);

            return {
                access_token: token,
                user: {
                    id: user.sub,
                    name: user.name,
                    role: user.role,
                    active_tenant: null,
                    active_tenant_name: 'Semua Puskesmas (Global)',
                },
            };
        }

        // Validate the target tenant exists and is ACTIVE
        const targetPuskesmas = await this.puskesmasService.findOne(switchTenantDto.tenant_id);
        if (!targetPuskesmas) {
            throw new NotFoundException('Puskesmas tidak ditemukan.');
        }

        // Check if target puskesmas is ACTIVE
        if (targetPuskesmas.status !== PuskesmasStatus.ACTIVE) {
            throw new ForbiddenException(
                `Puskesmas "${targetPuskesmas.name}" sedang tidak aktif. Tidak dapat switch ke tenant ini.`
            );
        }

        // Create new JWT with active_tenant
        const payload: JwtPayload = {
            sub: user.sub,
            name: user.name,
            role: user.role,
            puskesmas_id: user.puskesmas_id,
            active_tenant: switchTenantDto.tenant_id,
        };

        const token = await this.jwtService.signAsync(payload);

        // Update the admin's current token
        await this.adminsService.updateCurrentToken(user.sub, token);

        return {
            access_token: token,
            user: {
                id: user.sub,
                name: user.name,
                role: user.role,
                active_tenant: switchTenantDto.tenant_id,
                active_tenant_name: targetPuskesmas.name,
            },
        };
    }
}
