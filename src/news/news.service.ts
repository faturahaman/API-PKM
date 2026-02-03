import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import type { PaginateModel } from 'mongoose';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: PaginateModel<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto, imagePath: string) {
    const newNews = new this.newsModel({
      ...createNewsDto,
      image: imagePath,
      is_deleted: false,
    });
    return newNews.save();
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const filter: any = { is_deleted: false };

    // Fitur Search berdasarkan Judul
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    return await this.newsModel.paginate(filter, { 
      page, 
      limit, 
      sort: { date: -1 } // Berita terbaru (berdasarkan tanggal input) di atas
    });
  }

  async findOne(id: string) {
    const news = await this.newsModel.findOne({ _id: id, is_deleted: false }).exec();
    if (!news) throw new NotFoundException('Berita tidak ditemukan');
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto, imagePath?: string) {
    const updateData: any = { ...updateNewsDto };
    
    // Jika ada gambar baru diupload, update path-nya
    if (imagePath) {
      updateData.image = imagePath;
    }

    const updatedNews = await this.newsModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedNews) throw new NotFoundException('Berita tidak ditemukan');
    return updatedNews;
  }

  async remove(id: string) {
    const deletedNews = await this.newsModel.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );
    
    if (!deletedNews) throw new NotFoundException('Berita tidak ditemukan');
    return deletedNews;
  }
}