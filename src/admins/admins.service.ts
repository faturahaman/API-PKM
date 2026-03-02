import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entity/admin.entity';
import * as fs from 'fs';
import * as path from 'path';

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

  async updateProfile(id: string, filename: string | undefined, name: string): Promise<Omit<Admin, 'password'>> {
    const admin = await this.findOne(id);

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    if (filename && filename.trim() !== '') {
      // Delete old photo if it exists and is not the default
      if (admin.photo && admin.photo !== 'puskesmasLogo.png') {
        const oldPath = path.join(process.cwd(), 'public', 'uploads', 'profiles', admin.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      admin.photo = filename;
    }

    admin.name = name;
    const saved = await this.adminRepository.save(admin);
    const { password, ...result } = saved;
    return result;
  }

  async updateCurrentToken(id: string, token: string) {
    return this.adminRepository.update(id, { current_token: token });
  }
}