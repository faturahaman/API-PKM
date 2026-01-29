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

  
  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    const newBanner = new this.bannerModel(createBannerDto);
    newBanner.is_deleted = 0;

    return newBanner.save();
  }

  async findAll() {
    return this.bannerModel
      .find({ is_deleted: 0 })
      .sort({ createdAt: -1 })
      .exec();
  }

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

  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findOneAndUpdate(
        { _id: id, is_deleted: 0 },
        { $set: updateBannerDto },
        { new: true },
      )
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException(`Banner tidak ditemukan atau sudah dihapus`);
    }
    return updatedBanner;
  }

  async updateStatus(id: string, status: number): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findOneAndUpdate(
        { _id: id, is_deleted: 0 },
        { $set: { status: status } },
        { new: true },
      )
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException(`Banner tidak ditemukan atau sudah dihapus`);
    }
    return updatedBanner;
  }

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