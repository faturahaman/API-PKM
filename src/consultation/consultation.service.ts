import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Consultation } from './schemas/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepo: Repository<Consultation>,
  ) {}

  async create(createDto: CreateConsultationDto) {
    const newConsultation = this.consultationRepo.create(createDto);
    return await this.consultationRepo.save(newConsultation);
  }
  async findAllAdmin(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.consultationRepo.createQueryBuilder('c');

    if (search) {
      queryBuilder.where('c.subject LIKE :search OR c.username LIKE :search', { search: `%${search}%` });
    }

    queryBuilder.orderBy('c.created_at', 'DESC')
                .skip(skip)
                .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      last_page: Math.ceil(total / limit)
    };
  }

  async findAllPublic(page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.consultationRepo.findAndCount({
      where: { is_publish: true },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total, page, last_page: Math.ceil(total / limit) };
  }

  async update(id: number, updateDto: UpdateConsultationDto) {
    const consultation = await this.consultationRepo.findOneBy({ id });
    if (!consultation) throw new NotFoundException(`Consultation #${id} not found`);
    const updated = this.consultationRepo.merge(consultation, updateDto);
    return await this.consultationRepo.save(updated);
  }

  async remove(id: number) {
    const result = await this.consultationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Consultation #${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}