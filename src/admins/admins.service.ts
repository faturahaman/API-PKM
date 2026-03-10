import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminRole } from './entity/admin.entity';
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

 async findAll(search?: string, role?: string, limit?: number, offset?: number): Promise<{ data: Admin[], total: number }> {
  const query = this.adminRepository.createQueryBuilder('admin');

  if (search) {
    query.where('admin.name LIKE :search', { search: `%${search}%` });
  }

  if (role && role !== 'all') {
    query.andWhere('admin.role = :role', { role });
  }

  const total = await query.getCount();

  const data = await query
    .leftJoinAndSelect('admin.puskesmas', 'puskes') // cukup ini
    .orderBy('admin.created_at', 'DESC')
    .skip(offset || 0)
    .take(limit || 10)
    .getMany();

  const transformedData = data.map(admin => {
    const { password, ...rest } = admin as any;
    return {
      ...rest,
      puskes_name: admin.puskesmas ? admin.puskesmas.name : null,
    };
  });

  return { data: transformedData, total };
}

  // Konstanta untuk batasan operator
  private static readonly MAX_OPERATORS_PER_PUSKESMAS = 2;

  async create(name: string, password: string, role?: string, puskesmas_id?: string): Promise<Omit<Admin, 'password'>> {
    // Pengecekan duplikasi nama admin
    const existingAdmin = await this.adminRepository.findOne({ where: { name } });
    if (existingAdmin) {
      throw new BadRequestException('Nama admin sudah digunakan');
    }

    // Validasi untuk role OPERATOR
    if (role === 'OPERATOR' || (!role && 'OPERATOR')) {
      const operatorRole = role as AdminRole || AdminRole.OPERATOR;

      // Jika puskesmas_id tidak diisi untuk OPERATOR
      if (!puskesmas_id) {
        throw new BadRequestException('Operator harus ditugaskan ke puskesmas');
      }

      // Validasi: satu puskesmas hanya boleh punya maksimal 2 operator
      const existingOperators = await this.adminRepository
        .createQueryBuilder('admin')
        .where('admin.puskesmas_id = :puskesmas_id', { puskesmas_id })
        .andWhere('admin.role = :role', { role: operatorRole })
        .getCount();

      if (existingOperators >= AdminsService.MAX_OPERATORS_PER_PUSKESMAS) {
        throw new BadRequestException(
          `Puskesmas ini sudah memiliki ${existingOperators} operator. Maksimal ${AdminsService.MAX_OPERATORS_PER_PUSKESMAS} operator per puskesmas.`
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.adminRepository.create({
      name,
      password: hashedPassword,
      role: (role as AdminRole) || AdminRole.OPERATOR,
      puskesmas_id: puskesmas_id || undefined,
    });
    const saved = await this.adminRepository.save(admin);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = saved as Admin;
    return result;
  }

  async update(id: string, dto: UpdateAdminDto): Promise<Omit<Admin, 'password'>> {
    const admin = await this.findOne(id);
    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    // Validasi konfirmasi password jika password diisi
    if (dto.password) {
      if (!dto.password_confirmation) {
        throw new BadRequestException('Konfirmasi password wajib diisi');
      }
      if (dto.password !== dto.password_confirmation) {
        throw new BadRequestException('Password dan konfirmasi password tidak cocok');
      }
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    // Validasi untuk perubahan role atau puskesmas_id
    const newRole = dto.role || admin.role;
    const newPuskesmasId = dto.puskesmas_id !== undefined ? dto.puskesmas_id : admin.puskesmas_id;

    // Jika menjadi OPERATOR atau puskesmas_id berubah
    if (newRole === AdminRole.OPERATOR || (dto.puskesmas_id && dto.puskesmas_id !== admin.puskesmas_id)) {
      // Validasi: satu operator hanya boleh satu puskes
      if (newPuskesmasId && admin.role === AdminRole.SUPER_ADMIN && newRole === AdminRole.OPERATOR) {
        // Cek apakah operator lain sudah diassign ke puskesmas ini
        const existingOperators = await this.adminRepository
          .createQueryBuilder('admin')
          .where('admin.puskesmas_id = :puskesmas_id', { puskesmas_id: newPuskesmasId })
          .andWhere('admin.role = :role', { role: AdminRole.OPERATOR })
          .andWhere('admin.id != :id', { id })
          .getCount();

        if (existingOperators >= AdminsService.MAX_OPERATORS_PER_PUSKESMAS) {
          throw new BadRequestException(
            `Puskesmas ini sudah memiliki ${existingOperators} operator. Maksimal ${AdminsService.MAX_OPERATORS_PER_PUSKESMAS} operator per puskesmas.`
          );
        }
      }
    }

    Object.assign(admin, dto);
    const saved = await this.adminRepository.save(admin);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = saved as Admin;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = saved as Admin;
    return result;
  }

  async updateCurrentToken(id: string, token: string) {
    return this.adminRepository.update(id, { current_token: token });
  }

  /**
   * Mendapatkan daftar puskesmas yang masih bisa ditambahkan operator
   * (yang memiliki kurang dari 2 operator)
   */
  async getAvailablePuskesmasForOperators(): Promise<{ id: string; name: string; operatorCount: number }[]> {
    // Get all puskesmas with their operator counts
    const puskesmasWithOperators = await this.adminRepository
      .createQueryBuilder('admin')
      .select('admin.puskesmas_id', 'puskesmasId')
      .addSelect('COUNT(*)', 'operatorCount')
      .where('admin.role = :role', { role: AdminRole.OPERATOR })
      .andWhere('admin.puskesmas_id IS NOT NULL')
      .groupBy('admin.puskesmas_id')
      .getRawMany();

    const operatorCountMap = new Map<string, number>();
    puskesmasWithOperators.forEach((item: any) => {
      operatorCountMap.set(item.puskesmasId, parseInt(item.operatorCount));
    });

    // Return puskesmas IDs that have less than 2 operators
    // We'll return just the IDs - the controller should get puskesmas details from puskesmas service
    const availablePuskesmas: { id: string; name: string; operatorCount: number }[] = [];

    for (const [puskesmasId, count] of operatorCountMap.entries()) {
      if (count < AdminsService.MAX_OPERATORS_PER_PUSKESMAS) {
        availablePuskesmas.push({
          id: puskesmasId,
          name: '', // Will be filled by controller
          operatorCount: count,
        });
      }
    }

    return availablePuskesmas;
  }

  /**
   * Mendapatkan semua operator untuk puskesmas tertentu
   */
  async getOperatorsByPuskes(puskesId: string): Promise<Omit<Admin, 'password'>[]> {
    const operators = await this.adminRepository.find({
      where: {
        puskesmas_id: puskesId,
        role: AdminRole.OPERATOR,
      },
      order: { created_at: 'DESC' },
    });

    return operators.map(op => {
      const { password, ...result } = op;
      return result;
    });
  }

  /**
   * Mendapatkan semua operator dengan informasi puskesmas
   */
  async getAllOperatorsWithPuskes(): Promise<{
    id: string;
    name: string;
    role: string;
    puskesmas_id: string | null;
    created_at: Date;
  }[]> {
    const operators = await this.adminRepository.find({
      where: {
        role: AdminRole.OPERATOR,
      },
      order: { created_at: 'DESC' },
      select: ['id', 'name', 'role', 'puskesmas_id', 'created_at'],
    });

    return operators;
  }
}