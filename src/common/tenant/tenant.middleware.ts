// src/common/tenant/tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from './tenant-context.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Asumsi lu punya Entity Puskesmas, sesuaikan path-nya ya
import { Puskesmas } from '../../puskesmas/entity/puskesmas.entity';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(
        private readonly tenantContextService: TenantContextService,
        @InjectRepository(Puskesmas)
        private readonly puskesmasRepo: Repository<Puskesmas>
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const slug = req.headers['x-tenant-slug'] as string;
        let tenantId: string | null = null; // Default null (global)

        // Kalau ada slug dan bukan 'default' atau localhost
        if (slug && slug !== 'default') {
            // Cari Puskesmas berdasarkan slug (misal: 'bogortengah')
            const foundPuskesmas = await this.puskesmasRepo.findOne({
                where: { slug: slug },
                select: ['id'] // Ambil ID-nya doang biar enteng
            });

            if (foundPuskesmas) {
                tenantId = foundPuskesmas.id; // Ketemu ID-nya! (UUID)
            }
        }

        // Jalankan seluruh request backend di dalam "Ruangan Context" tenant ini
        this.tenantContextService.runWithContext(() => {
            // Set tenantId setelah context dibuat
            this.tenantContextService.updateContext({ tenantId });
            next();
        });
    }
}
