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



  async create(createVideoDto: CreateVideoDto, file?: Express.Multer.File) {
    const { is_embed, embed_url, video_title, ...videoData } = createVideoDto;
    
    const isEmbedBoolean = String(is_embed) === '1' || String(is_embed) === 'true';
    if (video_title) {
      const existingVideo = await this.videoModel.findOne({ video_title }).exec();
      if (existingVideo) {
        throw new BadRequestException('Video dengan judul tersebut sudah ada!');
      }
    }

    console.log(`Input: ${is_embed} | Hasil Convert: ${isEmbedBoolean}`);

    let finalDataString = '';

    if (isEmbedBoolean) { 
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
      video_title,         
      is_embed: isEmbedBoolean,
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