import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agenda } from './entity/agenda.entity';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';

@Injectable()
export class AgendaService {
  private readonly logger = new Logger(AgendaService.name);
  private agendaRepository: BaseTenantRepository<Agenda>;

  constructor(
    @InjectRepository(Agenda)
    agendaRepositoryNative: Repository<Agenda>,
    private readonly tenantContextService: TenantContextService,
    private readonly logactivityService: LogactivityService,
  ) {
    this.agendaRepository = new BaseTenantRepository(agendaRepositoryNative, tenantContextService);
  }

  async create(createAgendaDto: CreateAgendaDto) {
    const newAgenda = this.agendaRepository.create({
      ...createAgendaDto,
      is_deleted: false,
    });
    const savedAgenda = await this.agendaRepository.save(newAgenda);

    // Log activity - CREATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.CREATE,
        module: 'AGENDA',
        entity_id: savedAgenda.id,
        payload_after: {
          title: savedAgenda.title,
          date: savedAgenda.date,
          description: savedAgenda.description?.substring(0, 100),
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedAgenda;
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
    const oldAgenda = await this.findOne(id);
    const beforeData = {
      activity_name: oldAgenda.activity_name,
      date: oldAgenda.date,
      location: oldAgenda.location,
    };

    this.agendaRepository.merge(oldAgenda, updateData);
    const savedAgenda = await this.agendaRepository.save(oldAgenda);

    // Log activity - UPDATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.UPDATE,
        module: 'AGENDA',
        entity_id: savedAgenda.id,
        payload_before: beforeData,
        payload_after: {
          activity_name: savedAgenda.activity_name,
          date: savedAgenda.date,
          location: savedAgenda.location,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedAgenda;
  }

  async remove(id: string) {
    const agenda = await this.findOne(id);
    const deletedData = {
      activity_name: agenda.activity_name,
      date: agenda.date,
    };

    agenda.is_deleted = true;
    const savedAgenda = await this.agendaRepository.save(agenda);

    // Log activity - DELETE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.DELETE,
        module: 'AGENDA',
        entity_id: savedAgenda.id,
        payload_before: deletedData,
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedAgenda;
  }
}