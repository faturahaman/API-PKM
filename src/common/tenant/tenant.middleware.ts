// src/common/tenant/tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from './tenant-context.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        let tenantId: string | null = null;

        // Kalau ada slug dan bukan 'default' atau localhost
        if (slug && slug !== 'default') {
            const foundPuskesmas = await this.puskesmasRepo.findOne({
                where: { slug: slug },
                select: ['id']
            });

            if (foundPuskesmas) {
                tenantId = foundPuskesmas.id;
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
