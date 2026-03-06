import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogActivity, LogActivityAction } from './entity/log-activity.entity';
import { TenantContextService } from '../common/tenant/tenant-context.service';

export interface CreateLogActivityDto {
    action: LogActivityAction;
    module: string;
    entity_id?: string;
    payload_before?: Record<string, any>;
    payload_after?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
}

@Injectable()
export class LogactivityService {
    constructor(
        @InjectRepository(LogActivity)
        private readonly logActivityRepository: Repository<LogActivity>,
        private readonly tenantContextService: TenantContextService,
    ) { }

    async log(dto: CreateLogActivityDto): Promise<LogActivity> {
        const logData = {
            admin_id: this.tenantContextService.getUserId() || undefined,
            puskesmas_id: this.tenantContextService.getTenantId() || undefined,
            action: dto.action,
            module: dto.module,
            entity_id: dto.entity_id,
            payload_before: dto.payload_before,
            payload_after: dto.payload_after,
            ip_address: dto.ip_address,
            user_agent: dto.user_agent,
        };

        const logActivity = this.logActivityRepository.create(logData);
        return this.logActivityRepository.save(logActivity);
    }

    async findAllByTenant(
        page: number = 1,
        limit: number = 10,
    ): Promise<{ data: LogActivity[]; total: number }> {
        const tenantId = this.tenantContextService.getTenantId();
        const isSuperAdmin = this.tenantContextService.isSuperAdmin();

        const queryBuilder = this.logActivityRepository.createQueryBuilder('log');

        // If not super admin, filter by tenant
        if (!isSuperAdmin && tenantId) {
            queryBuilder.where('log.puskesmas_id = :puskesmasId', { puskesmasId: tenantId });
        }

        queryBuilder
            .orderBy('log.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return { data, total };
    }

    async findByAdmin(adminId: string): Promise<LogActivity[]> {
        return this.logActivityRepository.find({
            where: { admin_id: adminId },
            order: { created_at: 'DESC' },
            take: 100,
        });
    }
}
