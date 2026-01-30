import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from './schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { GalleryService } from 'src/gallery/gallery.service';
import type { PaginateModel } from 'mongoose';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name)
    private albumModel: PaginateModel<Album>,
    private galleryService: GalleryService
  ) { }

  // --- CREATE ---
  async create(createAlbumDto: CreateAlbumDto) {
    const { photo_ids, ...albumData } = createAlbumDto;

    // 1. Logic Auto Cover (Ambil foto pertama yg dipilih)
    let initialCover: string | null = null;
    if (photo_ids && photo_ids.length > 0) {
      const firstPhoto = await this.galleryService.findOne(photo_ids[0]);
      if (firstPhoto) initialCover = firstPhoto.image;
    }

    // 2. Buat Album
    const newAlbum = new this.albumModel({
      ...albumData,
      count: photo_ids ? photo_ids.length : 0,
      album_cover: albumData.album_cover || initialCover,
    });

    const savedAlbum = await newAlbum.save();

    if (photo_ids && photo_ids.length > 0) {
      await this.galleryService.updateAlbumId(photo_ids, savedAlbum._id.toString());
    }

    return savedAlbum;
  }

  // --- FIND ALL ---
  async findAll(page: number = 1, limit: number = 10) {
    return await this.albumModel.paginate({}, { page, limit, sort: { createdAt: -1 } });
  }

  // --- FIND ONE ---
  async findOne(id: string) {
    return this.albumModel.findById(id).exec();
  }

  // --- DELETE (Penting!) ---
  async remove(id: string) {
    // 1. SEBELUM HAPUS ALBUM -> RESET DULU FOTONYA
    // "Eh foto-foto, album kalian mau digusur, alamat kalian jadi null ya!"
    await this.galleryService.resetAlbumId(id);

    // 2. BARU HAPUS ALBUMNYA
    const deletedAlbum = await this.albumModel.findByIdAndDelete(id);

    if (!deletedAlbum) throw new NotFoundException('Album tidak ditemukan');
    return deletedAlbum;
  }

  // --- UPDATE ---
  async update(id: string, updateData: Partial<Album>) {
    const updatedAlbum = await this.albumModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedAlbum) throw new NotFoundException('Album tidak ditemukan');
    return updatedAlbum;
  }
}