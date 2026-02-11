import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { News } from './entity/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) { }

  async create(createNewsDto: CreateNewsDto, imagePath: string) {
    const newNews = this.newsRepository.create({
      ...createNewsDto,
      image: imagePath,
      is_deleted: false,
    });
    return this.newsRepository.save(newNews);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { is_deleted: false };

    // Fitur Search berdasarkan Judul
    if (search) {
      where.title = Like(`%${search}%`);
    }

    const [data, total] = await this.newsRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { date: 'DESC' } // Berita terbaru (berdasarkan tanggal input) di atas
    });

    return {
      docs: data,
      totalDocs: total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const news = await this.newsRepository.findOne({
      where: { id, is_deleted: false }
    });
    if (!news) throw new NotFoundException('Berita tidak ditemukan');
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto, imagePath?: string) {
    let updateData: any = { ...updateNewsDto };

    // Jika ada gambar baru diupload, update path-nya
    if (imagePath) {
      updateData.image = imagePath;
    }

    const news = await this.findOne(id);
    this.newsRepository.merge(news, updateData);
    return this.newsRepository.save(news);
  }

  async remove(id: string) {
    const news = await this.findOne(id);
    news.is_deleted = true;
    return this.newsRepository.save(news);
  }
}