import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agenda } from './schemas/agenda.entity';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
  ) { }

  async create(createAgendaDto: CreateAgendaDto) {
    const newAgenda = this.agendaRepository.create({
      ...createAgendaDto,
      is_deleted: false,
    });
    return this.agendaRepository.save(newAgenda);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.agendaRepository.findAndCount({
      where: { is_deleted: false },
      skip,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      docs: data,
      totalDocs: total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const agenda = await this.agendaRepository.findOne({
      where: { id, is_deleted: false }
    });
    if (!agenda) throw new NotFoundException('Agenda tidak ditemukan');
    return agenda;
  }

  async update(id: string, updateData: UpdateAgendaDto) {
    const agenda = await this.findOne(id);
    this.agendaRepository.merge(agenda, updateData);
    return this.agendaRepository.save(agenda);
  }

  async remove(id: string) {
    const agenda = await this.findOne(id);
    agenda.is_deleted = true;
    return this.agendaRepository.save(agenda);
  }
}