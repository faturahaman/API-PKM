import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Album } from './entity/album.entity';
import { GalleryService } from '../gallery/gallery.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private galleryService: GalleryService,
  ) { }

  async create(createAlbumDto: CreateAlbumDto) {
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

  async remove(id: string) {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album tidak ditemukan');
    }

    await this.galleryService.resetAlbumId(id);
    return this.albumRepository.remove(album);
  }

  async update(id: string, updateData: Partial<Album>) {

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

    const album = await this.albumRepository.preload({
      id: id,
      ...updateData,
    });

    if (!album) {
      throw new NotFoundException('Album tidak ditemukan');
    }

    return this.albumRepository.save(album);
  }
}