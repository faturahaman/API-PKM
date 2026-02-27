import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuskesmasInfo } from './entity/puskesmas-info.entity';
import { CreatePuskesmasInfoDto, UpdatePuskesmasInfoDto } from './dto/puskesmas-info.dto';

@Injectable()
export class PuskesmasInfoService {
    constructor(
        @InjectRepository(PuskesmasInfo)
        private readonly repository: Repository<PuskesmasInfo>,
    ) { }

    async getInfo(): Promise<PuskesmasInfo> {
        const info = await this.repository.find();
        if (info.length === 0) {
            // Create a default one if it doesn't exist
            const newInfo = this.repository.create({
                web_title: 'Puskesmas',
                social_links: {},
            });
            return await this.repository.save(newInfo);
        }
        return info[0];
    }

    async updateInfo(dto: UpdatePuskesmasInfoDto): Promise<PuskesmasInfo> {
        const info = await this.getInfo();
        Object.assign(info, dto);
        return await this.repository.save(info);
    }
}
