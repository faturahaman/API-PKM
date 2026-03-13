import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puskesmas, PuskesmasStatus } from './entity/puskesmas.entity';
import { CreatePuskesmasDto } from './dto/create-puskesmas.dto';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';

@Injectable()
export class PuskesmasService implements OnModuleInit {
    private readonly logger = new Logger(PuskesmasService.name);

    constructor(
        @InjectRepository(Puskesmas)
        private readonly puskesmasRepository: Repository<Puskesmas>,
        private readonly logactivityService: LogactivityService,
    ) { }

    async onModuleInit() {
        // Check if default tenant exists, create if not
        await this.ensureDefaultTenant();
    }

    async ensureDefaultTenant() {
        const existingTenant = await this.puskesmasRepository.findOne({
            where: { slug: 'default' },
        });

        if (!existingTenant) {
            const defaultTenant: CreatePuskesmasDto = {
                name: 'Puskesmas Default',
                slug: 'default',
                status: PuskesmasStatus.ACTIVE,
            };
            await this.puskesmasRepository.save(
                this.puskesmasRepository.create(defaultTenant),
            );
            console.log('✅ Default tenant created: Puskesmas Default');
        }
    }

    async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;

        const queryBuilder = this.puskesmasRepository.createQueryBuilder('puskesmas');

        // Add search functionality
        if (search) {
            queryBuilder.where('LOWER(puskesmas.name) LIKE LOWER(:search)', {
                search: `%${search}%`
            })
        }

        const [data, total] = await queryBuilder
            .orderBy('puskesmas.name', 'ASC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            docs: data,
            totalDocs: total,
            limit,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<Puskesmas | null> {
        return this.puskesmasRepository.findOne({ where: { id } });
    }

    async findBySlug(slug: string): Promise<Puskesmas | null> {
        return this.puskesmasRepository.findOne({ where: { slug } });
    }

    /**
     * Get only status info for a puskesmas (lightweight, for frontend check)
     */
    async getStatus(slug: string): Promise<{ status: string; name: string; message?: string } | null> {
        const puskesmas = await this.puskesmasRepository.findOne({
            where: { slug },
            select: ['id', 'name', 'status', 'maintenance_message', 'suspended_reason', 'deactivated_reason']
        });

        if (!puskesmas) return null;

        let message: string | undefined;
        if (puskesmas.status === PuskesmasStatus.MAINTENANCE) {
            message = puskesmas.maintenance_message || 'Website sedang dalam perbaikan.';
        } else if (puskesmas.status === PuskesmasStatus.SUSPENDED) {
            message = puskesmas.suspended_reason || 'Website dinonaktifkan sementara.';
        } else if (puskesmas.status === PuskesmasStatus.INACTIVE) {
            message = puskesmas.deactivated_reason || 'Puskesmas sedang tidak aktif.';
        }

        return {
            status: puskesmas.status,
            name: puskesmas.name,
            message
        };
    }

    async create(createPuskesmasDto: CreatePuskesmasDto): Promise<Puskesmas> {
        const puskesmas = this.puskesmasRepository.create(createPuskesmasDto);
        const savedPuskesmas = await this.puskesmasRepository.save(puskesmas);

        // Log activity - CREATE
        try {
            await this.logactivityService.log({
                action: LogActivityAction.CREATE,
                module: 'PUSKESMAS',
                entity_id: savedPuskesmas.id,
                payload_after: {
                    name: savedPuskesmas.name,
                    slug: savedPuskesmas.slug,
                },
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return savedPuskesmas;
    }

    async update(id: string, updatePuskesmasDto: Partial<CreatePuskesmasDto>): Promise<Puskesmas | null> {
        const oldPuskesmas = await this.puskesmasRepository.findOne({ where: { id } });

        if (!oldPuskesmas) {
            return null;
        }

        const beforeData = {
            name: oldPuskesmas.name,
            slug: oldPuskesmas.slug,
            status: oldPuskesmas.status,
        };

        // Filter out undefined values and check if there are valid fields to update
        const validFields: Partial<CreatePuskesmasDto> = {};

        if (updatePuskesmasDto) {
            if (updatePuskesmasDto.name !== undefined) validFields.name = updatePuskesmasDto.name;
            if (updatePuskesmasDto.slug !== undefined) validFields.slug = updatePuskesmasDto.slug;
            if (updatePuskesmasDto.status !== undefined) validFields.status = updatePuskesmasDto.status;
        }

        // Only perform update if there are valid fields
        if (Object.keys(validFields).length > 0) {
            await this.puskesmasRepository.update(id, validFields);
        }

        const updatedPuskesmas = await this.findOne(id);

        // Log activity - UPDATE
        try {
            await this.logactivityService.log({
                action: LogActivityAction.UPDATE,
                module: 'PUSKESMAS',
                entity_id: id,
                payload_before: beforeData,
                payload_after: updatedPuskesmas ? {
                    name: updatedPuskesmas.name,
                    slug: updatedPuskesmas.slug,
                    status: updatedPuskesmas.status,
                } : {},
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return updatedPuskesmas || null;
    }

    async remove(id: string): Promise<void> {
        const puskesToDelete = await this.puskesmasRepository.findOne({ where: { id } });

        const deletedData = puskesToDelete ? {
            name: puskesToDelete.name,
            slug: puskesToDelete.slug,
        } : {};

        await this.puskesmasRepository.delete(id);

        // Log activity - DELETE
        try {
            await this.logactivityService.log({
                action: LogActivityAction.DELETE,
                module: 'PUSKESMAS',
                entity_id: id,
                payload_before: deletedData,
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }
    }

    // === Status Management Methods ===

    /**
     * Activate a puskesmas (set to ACTIVE status)
     */
    async activate(id: string, adminId: string): Promise<Puskesmas | null> {
        const puskesmas = await this.findOne(id);
        if (!puskesmas) return null;

        const previousStatus = puskesmas.status;

        await this.puskesmasRepository.update(id, {
            status: PuskesmasStatus.ACTIVE,
            activated_at: new Date(),
            activated_by: adminId,
            deactivated_at: undefined,
            deactivated_by: undefined,
            suspended_at: undefined,
            suspended_by: undefined,
            suspended_reason: undefined,
        });

        // Log activity
        try {
            await this.logactivityService.log({
                action: LogActivityAction.ACTIVATE_TENANT,
                module: 'PUSKESMAS',
                entity_id: id,
                payload_before: { status: previousStatus },
                payload_after: { status: PuskesmasStatus.ACTIVE },
                admin_id: adminId,
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return this.findOne(id);
    }

    /**
     * Deactivate a pusblemas (set to INACTIVE status)
     */
    async deactivate(id: string, adminId: string, reason?: string): Promise<Puskesmas | null> {
        const puskesmas = await this.findOne(id);
        if (!puskesmas) return null;

        const previousStatus = puskesmas.status;

        await this.puskesmasRepository.update(id, {
            status: PuskesmasStatus.INACTIVE,
            deactivated_at: new Date(),
            deactivated_by: adminId,
            deactivated_reason: reason || undefined,
            activated_at: undefined,
            activated_by: undefined,
        });

        // Log activity
        try {
            await this.logactivityService.log({
                action: LogActivityAction.INACTIVATE_TENANT,
                module: 'PUSKESMAS',
                entity_id: id,
                payload_before: { status: previousStatus },
                payload_after: { status: PuskesmasStatus.INACTIVE, reason },
                admin_id: adminId,
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return this.findOne(id);
    }

    /**
     * Suspend a puskesmas (set to SUSPENDED status)
     */
    async suspend(id: string, adminId: string, reason: string): Promise<Puskesmas | null> {
        const puskesmas = await this.findOne(id);
        if (!puskesmas) return null;

        const previousStatus = puskesmas.status;

        await this.puskesmasRepository.update(id, {
            status: PuskesmasStatus.SUSPENDED,
            suspended_at: new Date(),
            suspended_by: adminId,
            suspended_reason: reason,
            activated_at: undefined,
            activated_by: undefined,
            deactivated_at: undefined,
            deactivated_by: undefined,
        });

        // Log activity
        try {
            await this.logactivityService.log({
                action: LogActivityAction.SUSPEND_TENANT,
                module: 'PUSKESMAS',
                entity_id: id,
                payload_before: { status: previousStatus },
                payload_after: { status: PuskesmasStatus.SUSPENDED, reason },
                admin_id: adminId,
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return this.findOne(id);
    }

    /**
     * Set puskesmas to maintenance mode
     */
    async setMaintenance(id: string, adminId: string, message?: string): Promise<Puskesmas | null> {
        const puskesmas = await this.findOne(id);
        if (!puskesmas) return null;

        await this.puskesmasRepository.update(id, {
            status: PuskesmasStatus.MAINTENANCE,
            maintenance_started_at: new Date(),
            maintenance_message: message || 'Website sedang dalam perbaikan',
        });

        return this.findOne(id);
    }

    /**
     * Remove maintenance mode
     */
    async removeMaintenance(id: string): Promise<Puskesmas | null> {
        const puskesmas = await this.findOne(id);
        if (!puskesmas) return null;

        await this.puskesmasRepository.update(id, {
            status: PuskesmasStatus.ACTIVE,
            maintenance_started_at: undefined,
            maintenance_message: undefined,
        });

        return this.findOne(id);
    }
}
