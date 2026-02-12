import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { Visitor } from './entity/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { Request } from 'express';
import { isbot } from 'isbot';

@Injectable()
export class VisitorService {
    constructor(
        @InjectRepository(Visitor)
        private readonly visitorRepository: Repository<Visitor>,
    ) { }

    // Manual Create 
    async create(dto: CreateVisitorDto) {
        const visitor = this.visitorRepository.create(dto);
        return await this.visitorRepository.save(visitor);
    }

    async trackVisitor(req: Request) {
        let ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
        if (Array.isArray(ip)) ip = ip[0];
        const ipString = (ip as string).replace('::ffff:', ''); // Clean IPv4 from IPv6 wrapper

        const userAgent = req.headers['user-agent'] || 'unknown';

        if (isbot(userAgent)) {
            return { message: 'Bot detected' };
        }

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const existingVisitorToday = await this.visitorRepository.findOne({
            where: {
                ip_address: ipString,
                visit_date: today,
            },
        });

        if (existingVisitorToday) {
            return { message: 'Visitor already tracked today.' };
        }

        const path = req.originalUrl || req.url;

        const visitor = this.visitorRepository.create({
            ip_address: ipString,
            user_agent: userAgent,
            visit_date: today,
            path: path,
        });

        return await this.visitorRepository.save(visitor);
    }


    async findAll() {
        return await this.visitorRepository.find({
            order: { created_at: 'DESC' }
        });
    }

    async countAll() {
        return await this.visitorRepository.count();
    }

    async countByDay() {
        const today = new Date().toISOString().split('T')[0];
        return await this.visitorRepository.count({
            where: {
                visit_date: today,
            },
        });
    }

    async countByMonth() {
        const date = new Date();
        const start = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

        return await this.visitorRepository.count({
            where: {
                visit_date: Between(start, end),
            },
        });
    }

    async countByYear() {
        const date = new Date();
        const start = new Date(date.getFullYear(), 0, 1).toISOString().split('T')[0];
        const end = new Date(date.getFullYear(), 11, 31).toISOString().split('T')[0];

        return await this.visitorRepository.count({
            where: {
                visit_date: Between(start, end),
            },
        });
    }
}