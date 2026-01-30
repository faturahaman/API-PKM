import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery } from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import type { Model, PaginateModel } from 'mongoose';
import { Album, AlbumDocument } from '../album/schemas/album.schema';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private galleryModel: PaginateModel<Gallery>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>
  ) { }

  async create(createGalleryDto: CreateGalleryDto, imagePath: string) {
    const newGallery = new this.galleryModel({
      ...createGalleryDto,
      image: imagePath,
      is_deleted: false,
    });
    return newGallery.save();
  }

  async findAll(page: number = 1, limit: number = 10, isNoAlbum: boolean = false, albumId?: string) {
    const filter: any = { is_deleted: false };

    if (isNoAlbum) {
      filter.album_id = null;
    } else if (albumId) {
      filter.album_id = albumId;
    }

    return await this.galleryModel.paginate(filter, { page, limit, sort: { upload_date: -1 } });
  }

  async findOne(id: string) {
    return this.galleryModel.findById(id).exec();
  }

  // 🔥 PERBAIKAN UTAMA ADA DI SINI
  async remove(id: string) {
    // 1. Cari dulu datanya sebelum dihapus (kita butuh album_id nya)
    const galleryToDelete = await this.galleryModel.findById(id);
    
    if (!galleryToDelete) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    // 2. Soft Delete (Set is_deleted = true)
    // Kita set album_id jadi null juga supaya tidak terhitung lagi (opsional, tapi lebih bersih)
    galleryToDelete.is_deleted = true;
    
    // Simpan album_id lama untuk proses sinkronisasi
    const oldAlbumId = galleryToDelete.album_id; 
    
    // Hapus referensi album di foto yang dihapus (opsional, sesuaikan kebutuhan)
    // galleryToDelete.album_id = null; 

    await galleryToDelete.save();

    // 3. JIKA FOTO INI PUNYA ALBUM, KITA WAJIB SYNC ALBUMNYA
    if (oldAlbumId) {
       await this.syncAlbumData(String(oldAlbumId));
    }

    return galleryToDelete;
  }

  async updateAlbumId(photoIds: string[], albumId: string) {
    await this.galleryModel.updateMany(
      { _id: { $in: photoIds } },
      { $set: { album_id: albumId } }
    ).exec();

    // Panggil fungsi sync yang lebih rapi
    await this.syncAlbumData(albumId);

    return { success: true };
  }

  async resetAlbumId(albumId: string) {
    return this.galleryModel.updateMany(
      { album_id: albumId },
      { $set: { album_id: null } }
    ).exec();
  }

  private async syncAlbumData(albumId: string) {
    const totalPhotos = await this.galleryModel.countDocuments({ 
        album_id: albumId, 
        is_deleted: false 
    });

    const latestPhoto = await this.galleryModel.findOne({ 
        album_id: albumId, 
        is_deleted: false 
    }).sort({ upload_date: -1 });

    const newCover = latestPhoto ? latestPhoto.image : null;

    await this.albumModel.findByIdAndUpdate(albumId, { 
        count: totalPhotos,
        album_cover: newCover
    });
  }
}