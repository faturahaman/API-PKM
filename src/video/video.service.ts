import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './schemas/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) { }

  async create(createVideoDto: CreateVideoDto, file?: Express.Multer.File) {
    const { is_embed, ...videoData } = createVideoDto;

    // Konversi is_embed ke boolean
    const isEmbedBoolean = String(is_embed) === '1' || String(is_embed) === 'true';

    // Cek duplikasi judul
    if (createVideoDto.video_title) {
      const existingVideo = await this.videoRepository.findOne({ where: { video_title: createVideoDto.video_title } });
      if (existingVideo) {
        throw new BadRequestException('Video dengan judul tersebut sudah ada!');
      }
    }

    let finalDataString = '';

    if (isEmbedBoolean) {
      // Jika embed, ambil dari DTO param embed_url
      if (!createVideoDto.embed_url) {
        throw new BadRequestException('Jika tipe embed, URL wajib diisi!');
      }
      if (!this.isValidUrl(createVideoDto.embed_url)) {
        throw new BadRequestException('URL Video tidak valid!');
      }
      finalDataString = createVideoDto.embed_url;

    } else {
      if (!file) {
        throw new BadRequestException('File video wajib diupload jika bukan embed!');
      }
      finalDataString = `/uploads/video/${file.filename}`;
    }

    const newVideo = this.videoRepository.create({
      ...videoData,
      video_title: createVideoDto.video_title,
      is_embed: isEmbedBoolean,
      data: finalDataString,
      is_deleted: false
    });

    return this.videoRepository.save(newVideo);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.videoRepository.findAndCount({
      where: { is_deleted: false },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      docs: data,
      totalDocs: total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async remove(id: string) {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException('Video tidak ditemukan');
    }
    video.is_deleted = true;
    return this.videoRepository.save(video);
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