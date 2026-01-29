import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: PaginateModel<VideoDocument>,
  ) {}

// src/video/video.service.ts

  async create(createVideoDto: CreateVideoDto, file?: Express.Multer.File) {
    // 1. Ambil raw datanya
    const { is_embed, embed_url, video_title, ...videoData } = createVideoDto;
    
    // 🔥 2. PAKSA CONVERT MANUAL (Solusi Anti Gagal)
    // Ini akan mengubah "0", 0, "false" menjadi boolean FALSE beneran.
    const isEmbedBoolean = String(is_embed) === '1' || String(is_embed) === 'true';

    if(video_title){
      const existingVideo = await this.videoModel.findOne({ video_title }).exec();
      if (existingVideo) {
        throw new BadRequestException('Video dengan judul tersebut sudah ada!');
      }
    }

    // Debugging: Cek terminal vscode buat liat hasilnya
    console.log(`Input: ${is_embed} | Hasil Convert: ${isEmbedBoolean}`);

    let finalDataString = '';

    // 🔥 3. PAKE VARIABLE BARU TADI DI SINI
    if (isEmbedBoolean) { 
      // --- LOGIKA EMBED ---
      if (!embed_url) {
        throw new BadRequestException('Jika tipe embed, URL wajib diisi!');
      }
      if (!this.isValidUrl(embed_url)) {
        throw new BadRequestException('URL Video tidak valid!');
      }
      finalDataString = embed_url;

    } else {
  
      
      if (!file) {
        throw new BadRequestException('File video wajib diupload jika bukan embed!');
      }
      finalDataString = `/uploads/video/${file.filename}`;
    }

    const newVideo = new this.videoModel({
      ...videoData,
      is_embed: isEmbedBoolean, // Simpan yang sudah bersih
      data: finalDataString,
      is_deleted: false
    });

    return newVideo.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    return this.videoModel.paginate(
      { is_deleted: false },
      { page, limit, sort: { upload_date: -1 } }
    );
  }

  async remove(id: string) {
    return this.videoModel.findByIdAndUpdate(id, { is_deleted: true }, { new: true });
  }

  private isValidUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }
}