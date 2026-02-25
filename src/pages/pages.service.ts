import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './entity/page.entity';
import { Menu } from '../menus/entity/menu.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
    constructor(
        @InjectRepository(Page)
        private pageRepository: Repository<Page>,
        @InjectRepository(Menu)
        private menuRepository: Repository<Menu>,
    ) { }

    async create(createPageDto: CreatePageDto, image?: Express.Multer.File, document?: Express.Multer.File) {
        if (!createPageDto.title || createPageDto.title.trim() === '') {
            throw new BadRequestException('Judul halaman wajib diisi');
        }

        const { menu_id, ...pageData } = createPageDto;

        const page = this.pageRepository.create({
            ...pageData,
            image: image ? `/uploads/pages/${image.filename}` : createPageDto.image,
            file: document ? `/uploads/pages/${document.filename}` : createPageDto.file,
        });

        if (menu_id && menu_id !== '' && menu_id !== '0' && menu_id !== null) {
            const menu = await this.menuRepository.findOneBy({ id: menu_id });
            if (!menu) throw new NotFoundException('Menu tidak ditemukan');
            page.menu = menu;
        } else {
            page.menu = null;
        }

        return this.pageRepository.save(page);
    }

    async findAllAdmin(search?: string, page: number = 1, limit: number = 10) {
        const query = this.pageRepository.createQueryBuilder('page');
        query.leftJoinAndSelect('page.menu', 'menu');

        if (search) {
            query.where('page.title LIKE :search', { search: `%${search}%` });
        }

        query.orderBy('page.createdAt', 'DESC');
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data: data.map((p) => ({
                ...p,
                menu_id: p.menu ? p.menu.id : null,
                menu: p.menu ? { id: p.menu.id, title: p.menu.title } : null,
            })),
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async findPelayanan() {
        return this.pageRepository.find({
            where: [
                { menu: { slug: 'pelayanan' }, status: 1 },
                { menu: { parent: { slug: 'pelayanan' } }, status: 1 },
            ],
            relations: ['menu', 'menu.parent'],
            order: { createdAt: 'ASC' },
        });
    }

    async findOne(id: string) {
        const page = await this.pageRepository.findOne({
            where: { id },
            relations: ['menu'],
        });
        if (!page) throw new NotFoundException('Halaman tidak ditemukan');
        return {
            ...page,
            menu_id: page.menu ? page.menu.id : null,
            menu: page.menu ? { id: page.menu.id, title: page.menu.title } : null,
        };
    }

    async findByMenuId(menuId: string) {
        const page = await this.pageRepository.findOne({
            where: { menu: { id: menuId }, status: 1 },
            relations: ['menu'],
        });
        if (!page) throw new NotFoundException('Halaman tidak ditemukan');
        return page;
    }

    // Ambil SEMUA halaman aktif berdasarkan menu (untuk list dokumen)
    async findAllByMenuId(menuId: string) {
        const pages = await this.pageRepository.find({
            where: { menu: { id: menuId }, status: 1 },
            relations: ['menu'],
            order: { createdAt: 'DESC' },
        });
        return pages;
    }

    async findPublished() {
        return this.pageRepository.find({
            where: { status: 1 },
            relations: ['menu'],
            order: { createdAt: 'DESC' },
        });
    }

    async update(id: string, updatePageDto: UpdatePageDto, image?: Express.Multer.File, document?: Express.Multer.File) {
        const pageData = await this.pageRepository.findOne({
            where: { id },
            relations: ['menu'],
        });
        if (!pageData) throw new NotFoundException('Halaman tidak ditemukan');

        const { menu_id, ...updateData } = updatePageDto;

        if (menu_id !== undefined) {
            if (menu_id === null || menu_id === '' || menu_id === '0') {
                pageData.menu = null;
            } else {
                const menu = await this.menuRepository.findOneBy({ id: menu_id });
                if (!menu) throw new NotFoundException('Menu tidak ditemukan');
                pageData.menu = menu;
            }
        }

        if (image) {
            pageData.image = `/uploads/pages/${image.filename}`;
        }

        if (document) {
            pageData.file = `/uploads/pages/${document.filename}`;
        }

        this.pageRepository.merge(pageData, updateData);
        return this.pageRepository.save(pageData);
    }

    async remove(id: string) {
        const result = await this.pageRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Halaman tidak ditemukan');
        return { deleted: true };
    }

    async toggleStatus(id: string) {
        const page = await this.pageRepository.findOneBy({ id });
        if (!page) throw new NotFoundException('Halaman tidak ditemukan');
        page.status = page.status === 1 ? 0 : 1;
        return this.pageRepository.save(page);
    }
}
