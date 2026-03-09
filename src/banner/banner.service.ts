import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entity/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';

/**
 * Activity Log Decorator for Banner Service
 * 
 * NOTE: The ActivityLog decorator and interceptor approach requires:
 * 1. Applying the ActivityLogInterceptor at the controller level
 * 2. Using @ActivityLog() decorator on service methods
 * 
 * For manual logging, you can use the LogactivityService directly as shown below.
 */
@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);
  private bannerRepository: BaseTenantRepository<Banner>;

  constructor(
    @InjectRepository(Banner)
    bannerRepositoryNative: Repository<Banner>,
    private readonly tenantContextService: TenantContextService,
    private readonly logactivityService: LogactivityService,
  ) {
    this.bannerRepository = new BaseTenantRepository(bannerRepositoryNative, tenantContextService);
  }

  // TERIMA FILE DISINI
  async create(createBannerDto: CreateBannerDto, file: Express.Multer.File): Promise<Banner> {
    const newBanner = this.bannerRepository.create({
      ...createBannerDto,
      image_path: `/uploads/banner/${file.filename}`, // Simpan path otomatis
      is_deleted: 0,
    });

    const savedBanner = await this.bannerRepository.save(newBanner);

    // Log activity - CREATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.CREATE,
        module: 'BANNER',
        entity_id: savedBanner.id,
        payload_after: {
          title: savedBanner.title,
          image_path: savedBanner.image_path,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedBanner;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.bannerRepository.findAndCount({
      where: { is_deleted: 0 },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      docs: data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({
      where: { id, is_deleted: 0 }
    });

    if (!banner) {
      throw new NotFoundException(`Banner dengan ID ${id} tidak ditemukan`);
    }
    return banner;
  }

  // UPDATE HANDLE GAMBAR BARU (JIKA ADA)
  async update(id: string, updateBannerDto: UpdateBannerDto, file?: Express.Multer.File): Promise<Banner> {
    // Get current banner for before state
    const currentBanner = await this.findOne(id);

    let updateData: any = { ...updateBannerDto };

    // Jika user upload gambar baru, update path-nya
    if (file) {
      updateData.image_path = `/uploads/banner/${file.filename}`;
      // (Optional) Logic hapus gambar lama bisa ditaruh disini kalau mau hemat storage
    }

    const banner = await this.findOne(id);
    this.bannerRepository.merge(banner, updateData);
    const updatedBanner = await this.bannerRepository.save(banner);

    // Log activity - UPDATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.UPDATE,
        module: 'BANNER',
        entity_id: id,
        payload_before: {
          title: currentBanner.title,
          is_publish: currentBanner.is_publish,
        },
        payload_after: {
          title: updatedBanner.title,
          is_publish: updatedBanner.is_publish,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return updatedBanner;
  }

  // FIX: GANTI 'status' JADI 'is_publish'
  async updateStatus(id: string, isPublish: boolean): Promise<Banner> {
    const banner = await this.findOne(id);
    banner.is_publish = isPublish;
    return this.bannerRepository.save(banner);
  }

  async remove(id: string) {
    const banner = await this.findOne(id);
    const deletedBanner = { ...banner };
    banner.is_deleted = 1;
    await this.bannerRepository.save(banner);

    // Log activity - DELETE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.DELETE,
        module: 'BANNER',
        entity_id: id,
        payload_before: {
          title: deletedBanner.title,
          is_publish: deletedBanner.is_publish,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return { message: 'Banner berhasil dihapus' };
  }
}