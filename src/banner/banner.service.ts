import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entity/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';

@Injectable()
export class BannerService {
  private bannerRepository: BaseTenantRepository<Banner>;

  constructor(
    @InjectRepository(Banner)
    bannerRepositoryNative: Repository<Banner>,
    private readonly tenantContextService: TenantContextService,
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

    return this.bannerRepository.save(newBanner);
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
    let updateData: any = { ...updateBannerDto };

    // Jika user upload gambar baru, update path-nya
    if (file) {
      updateData.image_path = `/uploads/banner/${file.filename}`;
      // (Optional) Logic hapus gambar lama bisa ditaruh disini kalau mau hemat storage
    }

    const banner = await this.findOne(id);
    this.bannerRepository.merge(banner, updateData);
    return this.bannerRepository.save(banner);
  }

  // FIX: GANTI 'status' JADI 'is_publish'
  async updateStatus(id: string, isPublish: boolean): Promise<Banner> {
    const banner = await this.findOne(id);
    banner.is_publish = isPublish;
    return this.bannerRepository.save(banner);
  }

  async remove(id: string) {
    const banner = await this.findOne(id);
    banner.is_deleted = 1;
    await this.bannerRepository.save(banner);

    return { message: 'Banner berhasil dihapus' };
  }
}