import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { LogActivity, LogActivityAction } from './entity/log-activity.entity';
import { TenantContextService } from '../common/tenant/tenant-context.service';

export interface CreateLogActivityDto {
    action: LogActivityAction;
    module: string;
    entity_id?: string | null;
    payload_before?: Record<string, any>;
    payload_after?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    route?: string;
    method?: string;
    status_code?: number;
    admin_id?: string;
    admin_name?: string;
    puskesmas_id?: string | null;
}

export interface ActivityLogQueryDto {
    page?: number;
    limit?: number;
    module?: string;
    action?: LogActivityAction;
    startDate?: string;
    endDate?: string;
    admin_id?: string;
    entity_id?: string;
}

export interface ActivitySummary {
    total: number;
    byAction: Record<string, number>;
    byModule: Record<string, number>;
    recentActivity: LogActivity[];
}

@Injectable()
export class LogactivityService implements OnModuleInit {
    private readonly logger = new Logger(LogactivityService.name);
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor(
        @InjectRepository(LogActivity)
        private readonly logActivityRepository: Repository<LogActivity>,
        private readonly tenantContextService: TenantContextService,
    ) { }

    /**
     * Initialize automatic cleanup on module init
     * Runs cleanup every 24 hours
     */
    onModuleInit() {
        // Run initial cleanup after 1 minute
        setTimeout(() => {
            this.autoCleanup().catch(err =>
                this.logger.error(`Initial cleanup failed: ${err.message}`)
            );
        }, 60000);

        // Then run cleanup every 24 hours
        this.cleanupInterval = setInterval(() => {
            this.autoCleanup().catch(err =>
                this.logger.error(`Scheduled cleanup failed: ${err.message}`)
            );
        }, 24 * 60 * 60 * 1000); // 24 hours

        this.logger.log('Activity log cleanup scheduled (every 24 hours)');
    }

    /**
     * Automatic cleanup - called by scheduler
     */
    async autoCleanup(daysOld: number = 90): Promise<number> {
        return this.deleteOldLogs(daysOld);
    }

    async log(dto: CreateLogActivityDto): Promise<LogActivity> {
        // Use provided values or fall back to tenant context
        const adminId = dto.admin_id || this.tenantContextService.getUserId();
        const puskesmasId = dto.puskesmas_id || this.tenantContextService.getTenantId();

        const logData = {
            admin_id: (adminId !== 'public' ? adminId : undefined) || undefined,
            admin_name: dto.admin_name || undefined,
            puskesmas_id: puskesmasId || undefined,
            action: dto.action,
            module: dto.module,
            entity_id: dto.entity_id || undefined,
            payload_before: dto.payload_before,
            payload_after: dto.payload_after,
            ip_address: dto.ip_address || undefined,
            user_agent: dto.user_agent || undefined,
            route: dto.route || undefined,
            method: dto.method || undefined,
            status_code: dto.status_code || undefined,
        };

        const logActivity = this.logActivityRepository.create(logData);
        return this.logActivityRepository.save(logActivity);
    }

    /**
     * Find all activity logs with filtering and pagination
     */
    async findAllWithFilters(
        query: ActivityLogQueryDto
    ): Promise<{ data: LogActivity[]; meta: { page: number; limit: number; total: number } }> {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 20, 100); // Max 100 items per page

        const tenantId = this.tenantContextService.getTenantId();
        const isSuperAdmin = this.tenantContextService.isSuperAdmin();

        const queryBuilder = this.logActivityRepository.createQueryBuilder('log');

        // If not super admin, filter by tenant
        if (!isSuperAdmin && tenantId) {
            queryBuilder.andWhere('log.puskesmas_id = :puskesmasId', { puskesmasId: tenantId });
        }

        // Apply filters
        if (query.module) {
            queryBuilder.andWhere('log.module = :module', { module: query.module });
        }

        if (query.action) {
            queryBuilder.andWhere('log.action = :action', { action: query.action });
        }

        if (query.admin_id) {
            queryBuilder.andWhere('log.admin_id = :adminId', { adminId: query.admin_id });
        }

        if (query.entity_id) {
            queryBuilder.andWhere('log.entity_id = :entityId', { entityId: query.entity_id });
        }

        // Date range filter
        if (query.startDate && query.endDate) {
            queryBuilder.andWhere('log.created_at BETWEEN :startDate AND :endDate', {
                startDate: new Date(query.startDate),
                endDate: new Date(query.endDate),
            });
        } else if (query.startDate) {
            queryBuilder.andWhere('log.created_at >= :startDate', {
                startDate: new Date(query.startDate),
            });
        } else if (query.endDate) {
            queryBuilder.andWhere('log.created_at <= :endDate', {
                endDate: new Date(query.endDate),
            });
        }

        // Order and paginate
        queryBuilder
            .orderBy('log.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            meta: { page, limit, total },
        };
    }

    /**
     * Get activity summary statistics
     */
    async getSummary(): Promise<ActivitySummary> {
        const tenantId = this.tenantContextService.getTenantId();
        const isSuperAdmin = this.tenantContextService.isSuperAdmin();

        const queryBuilder = this.logActivityRepository.createQueryBuilder('log');

        // If not super admin, filter by tenant
        if (!isSuperAdmin && tenantId) {
            queryBuilder.where('log.puskesmas_id = :puskesmaId', { puskesmaId: tenantId });
        }

        // Get total count
        const total = await queryBuilder.getCount();

        // Get count by action
        const byActionRaw = await queryBuilder
            .clone()
            .select('log.action', 'action')
            .addSelect('COUNT(*)', 'count')
            .groupBy('log.action')
            .getRawMany();

        const byAction: Record<string, number> = {};
        for (const item of byActionRaw) {
            byAction[item.action] = parseInt(item.count, 10);
        }

        // Get count by module
        const byModuleRaw = await queryBuilder
            .clone()
            .select('log.module', 'module')
            .addSelect('COUNT(*)', 'count')
            .groupBy('log.module')
            .getRawMany();

        const byModule: Record<string, number> = {};
        for (const item of byModuleRaw) {
            byModule[item.module] = parseInt(item.count, 10);
        }

        // Get recent activity (last 10)
        const recentActivity = await queryBuilder
            .clone()
            .orderBy('log.created_at', 'DESC')
            .take(10)
            .getMany();

        return {
            total,
            byAction,
            byModule,
            recentActivity,
        };
    }

    /**
     * Find logs by entity ID
     */
    async findByEntity(entityId: string): Promise<LogActivity[]> {
        const tenantId = this.tenantContextService.getTenantId();
        const isSuperAdmin = this.tenantContextService.isSuperAdmin();

        // If not super admin, filter by tenant
        if (!isSuperAdmin && tenantId) {
            return this.logActivityRepository.find({
                where: { entity_id: entityId, puskesmas_id: tenantId },
                order: { created_at: 'DESC' },
                take: 50,
            });
        }

        // Super admin can see all logs for the entity
        return this.logActivityRepository.find({
            where: { entity_id: entityId },
            order: { created_at: 'DESC' },
            take: 50,
        });
    }

    /**
     * Find logs by admin ID
     */
    async findByAdmin(adminId: string, limit: number = 100): Promise<LogActivity[]> {
        const tenantId = this.tenantContextService.getTenantId();
        const isSuperAdmin = this.tenantContextService.isSuperAdmin();

        // If not super admin, filter by tenant
        if (!isSuperAdmin && tenantId) {
            return this.logActivityRepository.find({
                where: { admin_id: adminId, puskesmas_id: tenantId },
                order: { created_at: 'DESC' },
                take: Math.min(limit, 100),
            });
        }

        // Super admin can see all logs for the admin
        return this.logActivityRepository.find({
            where: { admin_id: adminId },
            order: { created_at: 'DESC' },
            take: Math.min(limit, 100),
        });
    }

    /**
     * Delete logs older than specified days (for retention policy)
     */
    async deleteOldLogs(daysOld: number = 90): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await this.logActivityRepository.delete({
            created_at: LessThanOrEqual(cutoffDate),
        });

        this.logger.log(`Deleted ${result.affected} activity logs older than ${daysOld} days`);
        return result.affected || 0;
    }

    /**
     * Legacy method - kept for backward compatibility
     */
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

    /**
     * Legacy method - kept for backward compatibility
     */
    async findByAdminLegacy(adminId: string): Promise<LogActivity[]> {
        const tenantId = this.tenantContextService.getTenantId();
        const isSuperAdmin = this.tenantContextService.isSuperAdmin();

        // If not super admin, filter by tenant
        if (!isSuperAdmin && tenantId) {
            return this.logActivityRepository.find({
                where: { admin_id: adminId, puskesmas_id: tenantId },
                order: { created_at: 'DESC' },
                take: 100,
            });
        }

        // Super admin can see all logs
        return this.logActivityRepository.find({
            where: { admin_id: adminId },
            order: { created_at: 'DESC' },
            take: 100,
        });
    }
}
