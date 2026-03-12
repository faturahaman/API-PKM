import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Album } from './entity/album.entity';
import { GalleryService } from '../gallery/gallery.service';
import { CreateAlbumDto } from './dto/create-album.dto';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';
import { RequestMetaDto } from '../common/dto/request-meta.dto';

@Injectable()
export class AlbumService {
  private readonly logger = new Logger(AlbumService.name);
  private albumRepository: BaseTenantRepository<Album>;

  constructor(
    @InjectRepository(Album)
    albumRepositoryNative: Repository<Album>,
    private galleryService: GalleryService,
    private readonly tenantContextService: TenantContextService,
    private readonly logactivityService: LogactivityService,
  ) {
    this.albumRepository = new BaseTenantRepository(albumRepositoryNative, tenantContextService);
  }

  async create(createAlbumDto: CreateAlbumDto, requestMeta?: RequestMetaDto) {
    const { photo_ids, ...albumData } = createAlbumDto;

    // Check existing name
    const existing = await this.albumRepository.findOne({ where: { album_title: albumData.album_title } });
    if (existing) {
      throw new ConflictException('Nama album sudah digunakan');
    }

    let initialCover: string | null = null;
    if (photo_ids && photo_ids.length > 0) {
      const firstPhoto = await this.galleryService.findOne(photo_ids[0]);
      if (firstPhoto && firstPhoto.image) {
        initialCover = firstPhoto.image;
      }
    }

    const newAlbum = this.albumRepository.create({
      ...albumData,
      count: photo_ids ? photo_ids.length : 0,
      album_cover: albumData.album_cover || initialCover || undefined,
    });

    const savedAlbum = await this.albumRepository.save(newAlbum);

    if (photo_ids && photo_ids.length > 0) {
      await this.galleryService.updateAlbumId(photo_ids, savedAlbum.id);
    }

    // Log activity - CREATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.CREATE,
        module: 'ALBUM',
        entity_id: savedAlbum.id,
        ip_address: requestMeta?.ip_address,
        user_agent: requestMeta?.user_agent,
        route: requestMeta?.route,
        method: requestMeta?.method,
        payload_after: {
          album_title: savedAlbum.album_title,
          count: savedAlbum.count,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedAlbum;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    status: string = 'all',
  ) {
    const skip = (page - 1) * limit;

    // build query builder to allow conditional where clauses
    const qb = this.albumRepository.createQueryBuilder('album');

    if (search) {
      // case-insensitive title search
      qb.where('LOWER(album.album_title) LIKE :search', { search: `%${search.toLowerCase()}%` });
    }

    // placeholder: status filtering if ever needed; album entity has no status column
    if (status && status !== 'all') {
      // qb.andWhere('album.status = :status', { status });
      // leave as comment to indicate intent
    }

    qb.orderBy('album.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      docs: data,
      totalDocs: total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.albumRepository.findOne({ where: { id } });
  }

  async remove(id: string, requestMeta?: RequestMetaDto) {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album tidak ditemukan');
    }

    const deletedData = {
      album_title: album.album_title,
      count: album.count,
    };

    await this.galleryService.resetAlbumId(id);
    const result = await this.albumRepository.remove(album);

    // Log activity - DELETE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.DELETE,
        module: 'ALBUM',
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

    return result;
  }

  async update(id: string, updateData: Partial<Album>, requestMeta?: RequestMetaDto) {

    if (updateData.album_title) {
      const existing = await this.albumRepository.findOne({
        where: {
          album_title: updateData.album_title,
          id: Not(id)
        }
      });
      if (existing) {
        throw new ConflictException('Nama album sudah digunakan');
      }
    }

    const oldAlbum = await this.albumRepository.findOne({ where: { id } });
    const beforeData = oldAlbum ? {
      album_title: oldAlbum.album_title,
      count: oldAlbum.count,
    } : {};

    const album = await this.albumRepository.preload({
      id: id,
      ...updateData,
    });

    if (!album) {
      throw new NotFoundException('Album tidak ditemukan');
    }

    const savedAlbum = await this.albumRepository.save(album);

    // Log activity - UPDATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.UPDATE,
        module: 'ALBUM',
        entity_id: savedAlbum.id,
        ip_address: requestMeta?.ip_address,
        user_agent: requestMeta?.user_agent,
        route: requestMeta?.route,
        method: requestMeta?.method,
        payload_before: beforeData,
        payload_after: {
          album_title: savedAlbum.album_title,
          count: savedAlbum.count,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedAlbum;
  }
}