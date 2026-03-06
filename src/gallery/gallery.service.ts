import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Gallery } from './entity/gallery.entity';
import { Album } from '../album/entity/album.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';

@Injectable()
export class GalleryService {
  private galleryRepository: BaseTenantRepository<Gallery>;
  private albumRepository: BaseTenantRepository<Album>;

  constructor(
    @InjectRepository(Gallery)
    galleryRepositoryNative: Repository<Gallery>,
    @InjectRepository(Album)
    albumRepositoryNative: Repository<Album>,
    private readonly tenantContextService: TenantContextService
  ) {
    this.galleryRepository = new BaseTenantRepository(galleryRepositoryNative, tenantContextService);
    this.albumRepository = new BaseTenantRepository(albumRepositoryNative, tenantContextService);
  }

  async create(createGalleryDto: CreateGalleryDto, imagePath: string) {
    const newGallery = this.galleryRepository.create({
      ...createGalleryDto,
      image: imagePath,
      is_deleted: false,
    });
    return this.galleryRepository.save(newGallery);
  }

  async findAll(page: number = 1, limit: number = 10, isNoAlbum: boolean = false, albumId?: string) {
    const skip = (page - 1) * limit;

    const where: any = { is_deleted: false };

    if (isNoAlbum) {
      where.album_id = IsNull();
    } else if (albumId) {
      where.album_id = albumId;
    }

    const [data, total] = await this.galleryRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { upload_date: 'DESC' },
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
    return this.galleryRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const galleryToDelete = await this.galleryRepository.findOne({ where: { id } });

    if (!galleryToDelete) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    galleryToDelete.is_deleted = true;
    const oldAlbumId = galleryToDelete.album_id;

    await this.galleryRepository.save(galleryToDelete);

    if (oldAlbumId) {
      await this.syncAlbumData(String(oldAlbumId));
    }

    return galleryToDelete;
  }

  async updateAlbumId(photoIds: string[], albumId: string) {
    // Use tenant-aware update method
    await this.galleryRepository.update(
      { id: { in: photoIds } } as any,
      { album_id: albumId }
    );

    await this.syncAlbumData(albumId);

    return { success: true };
  }

  async resetAlbumId(albumId: string) {
    // Use tenant-aware update method
    return await this.galleryRepository.update(
      { album_id: albumId } as any,
      { album_id: null } as any
    );
  }

  async removeFromAlbum(photoIds: string[], albumId: string) {
    // Use tenant-aware update method
    await this.galleryRepository.update(
      { id: { in: photoIds } } as any,
      { album_id: null } as any
    );

    await this.syncAlbumData(albumId);
    return { success: true };
  }

  private async syncAlbumData(albumId: string) {
    const totalPhotos = await this.galleryRepository.count({
      where: { album_id: albumId, is_deleted: false }
    });

    const latestPhoto = await this.galleryRepository.findOne({
      where: { album_id: albumId, is_deleted: false },
      order: { upload_date: 'DESC' }
    });

    const newCover = latestPhoto ? latestPhoto.image : null;

    await this.albumRepository.update(albumId, {
      count: totalPhotos,
      album_cover: newCover || undefined
    });
  }
}