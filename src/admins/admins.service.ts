import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entity/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

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

  async findAll(search?: string, level?: string, limit?: number, offset?: number): Promise<{ data: Admin[], total: number }> {
    const query = this.adminRepository.createQueryBuilder('admin');

    if (search) {
      query.where('admin.name LIKE :search', { search: `%${search}%` });
    }

    if (level && level !== 'all') {
      query.andWhere('admin.level = :level', { level });
    }

    const total = await query.getCount();
    const data = await query.orderBy('admin.created_at', 'DESC').skip(offset || 0).take(limit || 10).getMany();

    return { data, total };
  }

  async create(name: string, password: string, level?: string): Promise<Omit<Admin, 'password'>> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.adminRepository.create({
      name,
      password: hashedPassword,
      level: level || 'operator',
    });
    const saved = await this.adminRepository.save(admin);
    const { password: _, ...result } = saved;
    return result;
  }

  async update(id: string, dto: UpdateAdminDto): Promise<Omit<Admin, 'password'>> {
    const admin = await this.findOne(id);
    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(admin, dto);
    const saved = await this.adminRepository.save(admin);
    const { password: _, ...result } = saved;
    return result;
  }

  async delete(id: string, currentAdminId?: string): Promise<void> {
    const admin = await this.findOne(id);
    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    // Prevent deleting current admin
    if (currentAdminId && id === currentAdminId) {
      throw new NotFoundException('Tidak dapat menghapus akun yang sedang aktif');
    }

    // Delete photo if exists
    if (admin.photo && admin.photo !== 'puskesmasLogo.png') {
      const photoPath = path.join(process.cwd(), 'public', 'uploads', 'profiles', admin.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await this.adminRepository.delete(id);
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