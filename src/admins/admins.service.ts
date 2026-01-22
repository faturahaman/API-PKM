import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schemas';

@Injectable()
export class AdminsService {
    constructor(@InjectModel(Admin.name)private adminModel: Model<AdminDocument>) {}
    
    async findOneByName(name: string): Promise<AdminDocument | null> {
      return this.adminModel.findOne({ name }).exec();
    }
}
