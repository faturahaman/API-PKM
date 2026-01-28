import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album } from './schemas/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { GalleryService } from 'src/gallery/gallery.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    private galleryService: GalleryService 
  ) {}

  // --- CREATE ---
  async create(createAlbumDto: CreateAlbumDto) {
    const { photo_ids, ...albumData } = createAlbumDto;
    
    // 1. Logic Auto Cover (Masih sama, ambil foto pertama yg dipilih)
    let initialCover: string | null = null;
    if (photo_ids && photo_ids.length > 0) {
       const firstPhoto = await this.galleryService.findOne(photo_ids[0]); 
       // Pastikan GalleryService punya findOne yg return object, atau query manual disini
       // Jika error, bisa skip logic cover ini
       if (firstPhoto) initialCover = firstPhoto.image;
    }

    // 2. Buat Album (TANPA Count)
    const newAlbum = new this.albumModel({
      ...albumData,
      album_cover: albumData.album_cover || initialCover,
      // count: dihapus[]
    });
    const savedAlbum = await newAlbum.save();

    // 3. Masukin Foto ke Album (Kasih Alamat)
    if (photo_ids && photo_ids.length > 0) {
      await this.galleryService.updateAlbumId(photo_ids, savedAlbum._id.toString());
    }

    return savedAlbum;
  }

  // --- FIND ALL ---
  async findAll() {
      // Tinggal ambil aja, gak ada urusan sama count lagi
      return this.albumModel.find().sort({ createdAt: -1 }).exec();
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
}