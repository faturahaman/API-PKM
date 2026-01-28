// src/banner/banner.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
  ) {}

  // CREATE
  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    const newBanner = new this.bannerModel(createBannerDto);
    return newBanner.save();
  }

  // FIND ALL (Hanya yang is_deleted = 0)
  async findAll() {
    return this.bannerModel
      .find({ is_deleted: 0 })
      .sort({ createdAt: -1 })
      .exec();
  }

  // FIND ONE (Hanya yang is_deleted = 0)
  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findOne({ 
      _id: id, 
      is_deleted: 0 
    }).exec();

    if (!banner) {
      throw new NotFoundException(`Banner dengan ID ${id} tidak ditemukan`);
    }
    return banner;
  }

  // UPDATE
  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findOneAndUpdate(
        { _id: id, is_deleted: 0 }, // Pastikan yang diedit belum dihapus
        { $set: updateBannerDto },
        { new: true }, // Return data terbaru
      )
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException(`Banner tidak ditemukan atau sudah dihapus`);
    }
    return updatedBanner;
  }

  // SOFT DELETE (Ubah is_deleted jadi 1)
  async remove(id: string) {
    const deletedBanner = await this.bannerModel
      .findOneAndUpdate(
        { _id: id, is_deleted: 0 },
        { $set: { is_deleted: 1 } },
        { new: true },
      )
      .exec();

    if (!deletedBanner) {
      throw new NotFoundException(`Banner tidak ditemukan`);
    }

    return { message: 'Banner berhasil dihapus' };
  }
}