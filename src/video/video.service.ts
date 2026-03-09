import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entity/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private videoRepository: BaseTenantRepository<Video>;

  constructor(
    @InjectRepository(Video)
    videoRepositoryNative: Repository<Video>,
    private readonly tenantContextService: TenantContextService,
    private readonly logactivityService: LogactivityService,
  ) {
    this.videoRepository = new BaseTenantRepository(videoRepositoryNative, tenantContextService);
  }

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
      embed: finalDataString,
      is_deleted: false
    });

    const savedVideo = await this.videoRepository.save(newVideo);

    // Log activity - CREATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.CREATE,
        module: 'VIDEO',
        entity_id: savedVideo.id,
        payload_after: {
          title: savedVideo.video_title,
          is_embed: savedVideo.is_embed,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedVideo;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.videoRepository.findAndCount({
      where: { is_deleted: false },
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

  async remove(id: string) {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException('Video tidak ditemukan');
    }

    const deletedData = {
      title: video.video_title,
      is_embed: video.is_embed,
    };

    video.is_deleted = true;
    const saved = await this.videoRepository.save(video);

    // Log activity - DELETE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.DELETE,
        module: 'VIDEO',
        entity_id: id,
        payload_before: deletedData,
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return saved;
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