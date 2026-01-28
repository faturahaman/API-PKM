import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album } from './schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { GalleryService } from 'src/gallery/gallery.service'; // Import service gallery
@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    private galleryService: GalleryService 
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const { photo_ids, ...albumData } = createAlbumDto;
    
    // 👇 MODIFIKASI DISINI: Tambahkan field count
    const newAlbum = new this.albumModel({
      ...albumData,
      count: photo_ids ? photo_ids.length : 0 // Simpan jumlah foto yg dipilih
    });

    const savedAlbum = await newAlbum.save();

    if (photo_ids && photo_ids.length > 0) {
      // Pastikan nama function ini sama dengan yang ada di GalleryService (Poin 1)
      await this.galleryService.updateAlbumId(photo_ids, savedAlbum._id.toString());
    }

    return savedAlbum;
  }

  async findAll() {
      // Sort berdasarkan createdAt desc (terbaru diatas)
      return this.albumModel.find().sort({ createdAt: -1 }).exec();
  }
}