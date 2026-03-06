import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KritikSaran } from './entity/kritik-saran.entity';
import { CreateKritikSaranDto, UpdateKritikSaranDto, KritikSaranQueryDto } from './dto/create-kritik-saran.dto';
import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';

@Injectable()
export class KritikSaranService {
    private repository: BaseTenantRepository<KritikSaran>;

    constructor(
        @InjectRepository(KritikSaran)
        private readonly kritikSaranRepository: Repository<KritikSaran>,
        private readonly tenantContextService: TenantContextService,
    ) {
        this.repository = new BaseTenantRepository(kritikSaranRepository, tenantContextService);
    }

    async create(createDto: CreateKritikSaranDto): Promise<KritikSaran> {
        const entity = this.repository.create(createDto);
        return this.repository.save(entity);
    }

    async findAll(query: KritikSaranQueryDto): Promise<{ data: KritikSaran[]; total: number; page: number; limit: number }> {
        const { page = 1, limit = 10, kategori, status } = query;

        const queryBuilder = this.repository.createQueryBuilder('ks');

        if (kategori) {
            queryBuilder.andWhere('ks.kategori = :kategori', { kategori });
        }

        if (status !== undefined) {
            queryBuilder.andWhere('ks.status = :status', { status });
        }

        queryBuilder.orderBy('ks.created_at', 'DESC');
        queryBuilder.skip((page - 1) * limit).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return { data, total, page, limit };
    }

    async findOne(id: string): Promise<KritikSaran | null> {
        return this.repository.findOneBy({ id } as any);
    }

    async update(id: string, updateDto: UpdateKritikSaranDto): Promise<KritikSaran | null> {
        const existing = await this.findOne(id);
        if (!existing) {
            return null;
        }

        const updated = Object.assign(existing, updateDto);
        return this.repository.save(updated);
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result as any).affected > 0;
    }

    async getStats(): Promise<{ total: number; baru: number; diproses: number; ditindaklanjuti: number }> {
        // Use tenant-aware query builder from BaseTenantRepository
        const counts = await this.repository
            .createQueryBuilder('ks')
            .select('ks.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('ks.status')
            .getRawMany();

        const stats = { total: 0, baru: 0, diproses: 0, ditindaklanjuti: 0 };

        for (const c of counts) {
            const count = parseInt(c.count);
            stats.total += count;
            if (c.status === 0) stats.baru = count;
            else if (c.status === 1) stats.diproses = count;
            else if (c.status === 2) stats.ditindaklanjuti = count;
        }

        return stats;
    }
}
