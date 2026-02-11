import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entity/admin.entity';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) { }

  async findOneByName(name: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { name } });
  }

  async findOne(id: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { id } });
  }

  async updateProfile(id: string, photoPath: string | undefined, name: string): Promise<Admin> {
    const admin = await this.findOne(id);

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    // Handle photo deletion if new photo is uploaded
    if (photoPath && photoPath.trim() !== "") {
      if (admin.photo && admin.photo !== 'puskesmasLogo.png') {
        const oldPath = path.join(process.cwd(), 'public/profiles', admin.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      admin.photo = photoPath;
    }

    admin.name = name;
    return this.adminRepository.save(admin);
  }
}