import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Agenda } from './schemas/agenda.schema';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import type { PaginateModel } from 'mongoose';

@Injectable()
export class AgendaService {
  constructor(
    @InjectModel(Agenda.name) private agendaModel: PaginateModel<Agenda>,
  ) {}

  async create(createAgendaDto: CreateAgendaDto) {
    const newAgenda = new this.agendaModel({
      ...createAgendaDto,
      is_deleted: false,
    });
    return newAgenda.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const filter = { is_deleted: false };
    // Sort berdasarkan tanggal agenda (date), bukan tanggal upload
    return await this.agendaModel.paginate(filter, { 
        page, 
        limit, 
        sort: { date: -1 } // Agenda terbaru (tanggalnya) muncul duluan
    });
  }

  async findOne(id: string) {
    const agenda = await this.agendaModel.findOne({ _id: id, is_deleted: false });
    if (!agenda) throw new NotFoundException('Agenda tidak ditemukan');
    return agenda;
  }

 async update(id: string, updateData: UpdateAgendaDto) {
    const updatedAgenda = await this.agendaModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    if (!updatedAgenda) throw new NotFoundException('Agenda tidak ditemukan');
    return updatedAgenda;
  }

  async remove(id: string) {
    const deletedAgenda = await this.agendaModel.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );
    
    if (!deletedAgenda) throw new NotFoundException('Agenda tidak ditemukan');
    return deletedAgenda;
  }
}