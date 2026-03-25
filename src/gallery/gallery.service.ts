import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Gallery } from './entity/gallery.entity';
import { Album } from '../album/entity/album.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';
import { RequestMetaDto } from '../common/dto/request-meta.dto';

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);
  private galleryRepository: BaseTenantRepository<Gallery>;
  private albumRepository: BaseTenantRepository<Album>;

  constructor(
    @InjectRepository(Gallery)
    galleryRepositoryNative: Repository<Gallery>,
    @InjectRepository(Album)
    albumRepositoryNative: Repository<Album>,
    private readonly tenantContextService: TenantContextService,
    private readonly logactivityService: LogactivityService,
  ) {
    this.galleryRepository = new BaseTenantRepository(galleryRepositoryNative, tenantContextService);
    this.albumRepository = new BaseTenantRepository(albumRepositoryNative, tenantContextService);
  }

  async create(createGalleryDto: CreateGalleryDto, imagePath: string, requestMeta?: RequestMetaDto) {
    const newGallery = this.galleryRepository.create({
      ...createGalleryDto,
      image: imagePath,
      is_deleted: false,
    });
    const savedGallery = await this.galleryRepository.save(newGallery);

    // Log activity - CREATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.CREATE,
        module: 'GALLERY',
        entity_id: savedGallery.id,
        ip_address: requestMeta?.ip_address,
        user_agent: requestMeta?.user_agent,
        route: requestMeta?.route,
        method: requestMeta?.method,
        payload_after: {
          title: savedGallery.image_title,
          image: savedGallery.image,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedGallery;
  }

  async findAll(page: number = 1, limit: number = parseInt(process.env.DEFAULT_PAGE_LIMIT || '10'), isNoAlbum: boolean = false, albumId?: string) {
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

  async remove(id: string, requestMeta?: RequestMetaDto) {
    const galleryToDelete = await this.galleryRepository.findOne({ where: { id } });

    if (!galleryToDelete) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    const deletedData = {
      title: galleryToDelete.image_title,
      image: galleryToDelete.image,
    };

    galleryToDelete.is_deleted = true;
    const oldAlbumId = galleryToDelete.album_id;

    const saved = await this.galleryRepository.save(galleryToDelete);

    if (oldAlbumId) {
      await this.syncAlbumData(String(oldAlbumId));
    }

    // Log activity - DELETE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.DELETE,
        module: 'GALLERY',
        entity_id: id,
        ip_address: requestMeta?.ip_address,
        user_agent: requestMeta?.user_agent,
        route: requestMeta?.route,
        method: requestMeta?.method,
        payload_before: deletedData,
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return saved;
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