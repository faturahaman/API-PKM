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
                alamat: '',
                status: PuskesmasStatus.ACTIVE,
            };
            await this.puskesmasRepository.save(
                this.puskesmasRepository.create(defaultTenant),
            );
            console.log('✅ Default tenant created: Puskesmas Default');
        }
    }

    async findAll(): Promise<Puskesmas[]> {
        return this.puskesmasRepository.find();
    }

    async findOne(id: string): Promise<Puskesmas | null> {
        return this.puskesmasRepository.findOne({ where: { id } });
    }

    async findBySlug(slug: string): Promise<Puskesmas | null> {
        return this.puskesmasRepository.findOne({ where: { slug } });
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

        const beforeData = oldPuskesmas ? {
            name: oldPuskesmas.name,
            slug: oldPuskesmas.slug,
            status: oldPuskesmas.status,
        } : {};

        await this.puskesmasRepository.update(id, updatePuskesmasDto);
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

        return updatedPuskesmas;
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
}
