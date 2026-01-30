import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import * as fs from 'fs';
import * as path from 'path'; 

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
  ) {}

  // TERIMA FILE DISINI
  async create(createBannerDto: CreateBannerDto, file: Express.Multer.File): Promise<Banner> {
    const newBanner = new this.bannerModel({
      ...createBannerDto,
      image_path: `/uploads/banner/${file.filename}`, // Simpan path otomatis
      is_deleted: 0,
    });

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

  // UPDATE HANDLE GAMBAR BARU (JIKA ADA)
  async update(id: string, updateBannerDto: UpdateBannerDto, file?: Express.Multer.File): Promise<Banner> {
    let updateData = { ...updateBannerDto };

    // Jika user upload gambar baru, update path-nya
    if (file) {
      updateData.image_path = `/uploads/banner/${file.filename}`;
      // (Optional) Logic hapus gambar lama bisa ditaruh disini kalau mau hemat storage
    }

    const updatedBanner = await this.bannerModel
      .findOneAndUpdate(
        { _id: id, is_deleted: 0 },
        { $set: updateData },
        { new: true },
      )
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException(`Banner tidak ditemukan atau sudah dihapus`);
    }
    return updatedBanner;
  }

  // FIX: GANTI 'status' JADI 'is_publish'
  async updateStatus(id: string, isPublish: boolean): Promise<Banner> {
    const updatedBanner = await this.bannerModel
      .findOneAndUpdate(
        { _id: id, is_deleted: 0 },
        { $set: { is_publish: isPublish } }, // ✅ Fixed
        { new: true },
      )
      .exec();

    if (!updatedBanner) {
      throw new NotFoundException(`Banner tidak ditemukan`);
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