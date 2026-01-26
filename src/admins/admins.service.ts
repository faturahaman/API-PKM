import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schemas';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) { }

  async findOneByName(name: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({ name }).exec();
  }

  async findOne(id: string): Promise<AdminDocument | null> {
    return this.adminModel.findById(id).select('-password').exec();
  }

  async updateProfile(id: string, photoPath: string | undefined, name: string): Promise<AdminDocument | null> {
    const admin = await this.adminModel.findById(id);

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    const updateData: any = { name };

    if (photoPath && photoPath.trim() !== "") { 
      if (admin.photo && admin.photo !== 'puskesmasLogo.png') {
        const oldPath = path.join(process.cwd(), 'public/profiles', admin.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updateData.photo = photoPath; 
    } else {
      updateData.photo = admin.photo; 
    }

    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .exec();

    return updatedAdmin;
}

}