import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { ServiceFlow } from './entities/service-flow.entity';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
        @InjectRepository(ServiceFlow)
        private readonly serviceFlowRepository: Repository<ServiceFlow>,
    ) { }

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        // Karena cascade: true di entity, kita bisa langsung save object nested
        const service = this.serviceRepository.create(createServiceDto);
        return await this.serviceRepository.save(service);
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await this.serviceRepository.findAndCount({
            skip,
            take: limit,
            order: {
                created_at: 'DESC',
            },
            relations: ['flows'], // Load relasi
        });

        // Optional: Sort flows manual di level aplikasi jika QueryBuilder terlalu ribet
        // karena 'relations' option tidak support sorting nested secara native dengan mudah.
        data.forEach(item => {
            if (item.flows) {
                item.flows.sort((a, b) => a.step_order - b.step_order);
            }
        });

        return {
            data,
            meta: {
                total,
                page,
                limit,
                last_page: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number): Promise<Service> {
        const service = await this.serviceRepository.findOne({
            where: { id },
            relations: ['flows'],
            order: {
                flows: {
                    step_order: 'ASC' // Cara sorting relation di TypeORM modern
                }
            } as any 
        });

        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }

        return service;
    }

    async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
        // 1. Cek existensi
        const existingService = await this.findOne(id);

        const { flows, ...serviceData } = updateServiceDto;

        // 2. Update data utama service
        await this.serviceRepository.update(id, serviceData);

        // 3. Handle Flows (One-to-Many Update Strategy)
        if (flows) {
            // Strategi: Hapus semua flow lama milik service ini, lalu insert yang baru.
            // Ini menangani kasus penambahan, penghapusan, atau pengubahan urutan sekaligus.
            
            // Hapus flow lama berdasarkan relasi service
            await this.serviceFlowRepository.delete({ service: { id: id } });

            // Buat instance flow baru
            const newFlows = flows.map((flowDto) => {
                return this.serviceFlowRepository.create({
                    ...flowDto,
                    service: existingService, // Link kembali ke parent
                });
            });

            // Simpan flow baru
            await this.serviceFlowRepository.save(newFlows);
        }

        // 4. Return data terbaru
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const result = await this.serviceRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }
    }
}