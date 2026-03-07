import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { Visitor } from './entity/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { Request } from 'express';
import { isbot } from 'isbot';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { Puskesmas } from '../puskesmas/entity/puskesmas.entity';

@Injectable()
export class VisitorService {
    private readonly logger = new Logger(VisitorService.name);
    private visitorRepository: BaseTenantRepository<Visitor>;

    constructor(
        // [UPGRADE 1]: Tambahin `private readonly` biar native repo bisa dipakai buat Raw Query Builder
        @InjectRepository(Visitor)
        private readonly visitorRepositoryNative: Repository<Visitor>,
        @InjectRepository(Puskesmas)
        private readonly puskesmasRepository: Repository<Puskesmas>,
        private readonly tenantContextService: TenantContextService,
        // [UPGRADE 2]: Inject Cache Manager ke dalam Service
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        this.visitorRepository = new BaseTenantRepository(visitorRepositoryNative, tenantContextService);
    }

    // Manual Create 
    async create(dto: CreateVisitorDto) {
        const visitor = this.visitorRepository.create(dto);
        return await this.visitorRepository.save(visitor);
    }

    async trackVisitor(req: Request) {
        let ip = req.headers['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || '0.0.0.0';
        if (Array.isArray(ip)) ip = ip[0];
        const ipString = (ip as string).replace('::ffff:', '');

        const userAgent = req.headers['user-agent'] || 'unknown';

        if (isbot(userAgent)) {
            return { message: 'Bot detected' };
        }

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const path = req.originalUrl || req.url;

        // Ambil puskesmas_id dari konteks
        const puskesmasId = this.tenantContextService.getTenantId();

        // Validasi: Jika puskesmasId diisi, pastikan puskesmas tersebut ada di database
        if (puskesmasId) {
            const puskesmas = await this.puskesmasRepository.findOne({
                where: { id: puskesmasId },
                select: ['id']
            });
            if (!puskesmas) {
                this.logger.warn(`Invalid puskesmas_id: ${puskesmasId} - visitor not tracked`);
                return { message: 'Invalid puskesmas_id - visitor not tracked' };
            }
        }

        try {
            // Gunakan repository biasa untuk insert (bypass tenant filtering untuk tracking)
            // Langsung insert, ignore jika duplikat (berdasarkan unique index)
            await this.visitorRepositoryNative.insert({
                puskesmas_id: puskesmasId || undefined,
                ip_address: ipString,
                user_agent: userAgent,
                visit_date: today,
                path: path
            });

            return { message: 'Visitor tracked successfully' };
        } catch (err: any) {
            // ER_DUP_ENTRY berarti visitor hari ini sudah ada (berdasarkan unique index)
            // Ini bukan error, jadi jangan log sebagai error
            if (err.code === 'ER_DUP_ENTRY') {
                return { message: 'Visitor already tracked' };
            }
            console.error('Error tracking visitor:', err);
            return { message: 'Failed to track visitor' };
        }
    }

    async findAll() {
        return await this.visitorRepository.find({
            order: { id: 'DESC' }
        });
    }

    async countAll() {
        const tenantId = this.tenantContextService.getTenantId() || 'global';
        const cacheKey = `visitor_count_all_${tenantId}`;

        const cached = await this.cacheManager.get<number>(cacheKey);
        if (cached !== undefined && cached !== null) return cached;

        // Filter by tenant if tenantId is available
        const where = tenantId !== 'global' ? { puskesmas_id: tenantId } : {};
        const result = await this.visitorRepository.count({ where });
        await this.cacheManager.set(cacheKey, result, 3600000); // Cache 1 Jam
        return result;
    }

    async countByDay() {
        const tenantId = this.tenantContextService.getTenantId() || 'global';
        const today = new Date().toISOString().split('T')[0];

        // [UPGRADE 4]: Tenant-Aware Caching
        const cacheKey = `visitor_count_day_${tenantId}_${today}`;

        const cached = await this.cacheManager.get<number>(cacheKey);
        if (cached !== undefined && cached !== null) return cached;

        // Filter by tenant if tenantId is available
        const where: Record<string, unknown> = {
            visit_date: today,
        };
        if (tenantId !== 'global') {
            where.puskesmas_id = tenantId;
        }
        const result = await this.visitorRepository.count({ where });

        await this.cacheManager.set(cacheKey, result, 300000); // Khusus harian, cache 5 menit aja biar admin liat update
        return result;
    }

    async countByMonth() {
        const tenantId = this.tenantContextService.getTenantId() || 'global';
        const date = new Date();
        const start = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

        const cacheKey = `visitor_count_month_${tenantId}_${start}`;

        const cached = await this.cacheManager.get<number>(cacheKey);
        if (cached !== undefined && cached !== null) return cached;

        // Filter by tenant if tenantId is available
        const where: Record<string, unknown> = {
            visit_date: Between(start, end),
        };
        if (tenantId !== 'global') {
            where.puskesmas_id = tenantId;
        }
        const result = await this.visitorRepository.count({ where });

        await this.cacheManager.set(cacheKey, result, 3600000); // Cache 1 Jam
        return result;
    }

    async countByYear() {
        const tenantId = this.tenantContextService.getTenantId() || 'global';
        const date = new Date();
        const start = new Date(date.getFullYear(), 0, 1).toISOString().split('T')[0];
        const end = new Date(date.getFullYear(), 11, 31).toISOString().split('T')[0];

        const cacheKey = `visitor_count_year_${tenantId}_${date.getFullYear()}`;

        const cached = await this.cacheManager.get<number>(cacheKey);
        if (cached !== undefined && cached !== null) return cached;

        // Filter by tenant if tenantId is available
        const where: Record<string, unknown> = {
            visit_date: Between(start, end),
        };
        if (tenantId !== 'global') {
            where.puskesmas_id = tenantId;
        }
        const result = await this.visitorRepository.count({ where });

        await this.cacheManager.set(cacheKey, result, 3600000); // Cache 1 Jam
        return result;
    }
}