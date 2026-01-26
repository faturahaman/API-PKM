import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schemas';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) { }

  async findOneByName(name: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({ name }).exec();
  }

  async findOne(id: string): Promise<AdminDocument | null> {
    return this.adminModel.findById(id).select('-password').exec();
  }

  async updateProfile(id: string, photoPath: string, name: string): Promise<AdminDocument> {
    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(
        id,
        { photo: photoPath, name },
        { new: true }
      )
      .select('-password')
      .exec();

    if (!updatedAdmin) {
      throw new NotFoundException('Admin not found');
    }

    return updatedAdmin;
  }

}

