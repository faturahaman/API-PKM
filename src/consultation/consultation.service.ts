import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from './entity/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { EmailService } from '../email/email.service';
import { RecaptchaService } from '../common/recaptcha/recaptcha.service';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';
import { RequestMetaDto } from '../common/dto/request-meta.dto';

@Injectable()
export class ConsultationService {
  private readonly logger = new Logger(ConsultationService.name);
  private consultationRepo: BaseTenantRepository<Consultation>;

  constructor(
    @InjectRepository(Consultation)
    consultationRepoNative: Repository<Consultation>,
    private readonly emailService: EmailService,
    private readonly recaptchaService: RecaptchaService,
    private readonly tenantContextService: TenantContextService,
    private readonly logactivityService: LogactivityService,
  ) {
    this.consultationRepo = new BaseTenantRepository(consultationRepoNative, tenantContextService);
  }

  async create(createDto: CreateConsultationDto) {
    await this.recaptchaService.verify(createDto.recaptchaToken);
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
      where: { is_publish: true, is_answer: true },
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

  async replyConsultation(id: number, answer: string) {
    const consultation = await this.consultationRepo.findOneBy({ id });
    if (!consultation) throw new NotFoundException(`Consultation #${id} not found`);

    if (!consultation.email) {
      throw new BadRequestException('Konsultasi ini tidak memiliki alamat email. Tidak bisa mengirim balasan.');
    }

    // Simpan jawaban ke database
    consultation.answer = answer;
    consultation.is_answer = true;
    await this.consultationRepo.save(consultation);

    // Kirim email ke pengunjung
    const subject = `Balasan Konsultasi: ${consultation.subject}`;
    const emailBody = `Halo ${consultation.username},\n\nTerima kasih telah menghubungi kami.\n\nPertanyaan Anda:\n"${consultation.message}"\n\nBalasan dari tim kami:\n${answer}\n\nHormat kami,\nTim Puskesmas`;

    await this.emailService.sendMail(consultation.email, subject, emailBody);

    return { message: 'Balasan berhasil dikirim dan disimpan!' };
  }

  async remove(id: number, requestMeta?: RequestMetaDto) {
    const consultationToDelete = await this.consultationRepo.findOne({ where: { id } });

    const deletedData = consultationToDelete ? {
      subject: consultationToDelete.subject,
      username: consultationToDelete.username,
    } : {};

    const result = await this.consultationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Consultation #${id} not found`);
    }

    // Log activity - DELETE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.DELETE,
        module: 'CONSULTATION',
        entity_id: String(id),
        ip_address: requestMeta?.ip_address,
        user_agent: requestMeta?.user_agent,
        route: requestMeta?.route,
        method: requestMeta?.method,
        payload_before: deletedData,
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return { message: 'Deleted successfully' };
  }
}