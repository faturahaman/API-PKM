import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puskesmas, PuskesmasStatus } from './entity/puskesmas.entity';
import { CreatePuskesmasDto } from './dto/create-puskesmas.dto';

@Injectable()
export class PuskesmasService implements OnModuleInit {
    constructor(
        @InjectRepository(Puskesmas)
        private readonly puskesmasRepository: Repository<Puskesmas>,
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
        return this.puskesmasRepository.save(puskesmas);
    }

    async update(id: string, updatePuskesmasDto: Partial<CreatePuskesmasDto>): Promise<Puskesmas | null> {
        await this.puskesmasRepository.update(id, updatePuskesmasDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.puskesmasRepository.delete(id);
    }
}
