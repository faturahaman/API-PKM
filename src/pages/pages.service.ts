import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Page } from './entity/page.entity';
import { Menu } from '../menus/entity/menu.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import slugify from 'slugify';

@Injectable()
export class PagesService {
    constructor(
        @InjectRepository(Page)
        private pageRepository: Repository<Page>,
        @InjectRepository(Menu)
        private menuRepository: Repository<Menu>,
    ) { }

    async create(createPageDto: CreatePageDto) {
        // Validasi title harus ada
        if (!createPageDto.title || createPageDto.title.trim() === '') {
            throw new Error('Title is required');
        }

        let slug = createPageDto.slug;
        if (!slug) {
            slug = slugify(createPageDto.title, { lower: true, strict: true });
        } else {
            slug = slugify(slug, { lower: true, strict: true });
        }

        // Check uniqueness
        await this.ensureSlugUnique(slug);

        const { menu_id, ...pageData } = createPageDto;
        const page = this.pageRepository.create({
            ...pageData,
            slug
        });

        // Handle menu_id - bisa null, undefined, atau UUID
        if (menu_id && menu_id !== '' && menu_id !== null) {
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
            data: data.map(p => ({
                ...p,
                menu_id: p.menu ? p.menu.id : null,
                menu: p.menu ? { id: p.menu.id, title: p.menu.title } : null
            })),
            total,
            page,
            lastPage: Math.ceil(total / limit)
        };
    }

    async findOne(id: string) {
        const page = await this.pageRepository.findOne({
            where: { id },
            relations: ['menu']
        });
        if (!page) throw new NotFoundException('Page not found');
        return {
            ...page,
            menu_id: page.menu ? page.menu.id : null,
            menu: page.menu ? { id: page.menu.id, title: page.menu.title } : null
        };
    }

    async findBySlug(slug: string) {
        const page = await this.pageRepository.findOne({
            where: { slug, status: 1 },
            relations: ['menu']
        });
        if (!page) throw new NotFoundException('Page not found');
        return page;
    }

    async findByMenuId(menuId: string) {
        const page = await this.pageRepository.findOne({
            where: { menu: { id: menuId }, status: 1 },
            relations: ['menu']
        });
        if (!page) throw new NotFoundException('Page not found');
        return page;
    }

    async findPublished() {
        return this.pageRepository.find({
            where: { status: 1 },
            relations: ['menu'],
            order: { createdAt: 'DESC' }
        });
    }

    async update(id: string, updatePageDto: UpdatePageDto) {
        const pageData = await this.pageRepository.findOne({
            where: { id },
            relations: ['menu']
        });
        if (!pageData) throw new NotFoundException('Page not found');

        const { menu_id, ...updateData } = updatePageDto;

        // Handle slug update - only change if explicitly provided
        if (updateData.slug !== undefined && updateData.slug !== '') {
            const newSlug = slugify(updateData.slug, { lower: true, strict: true });
            if (newSlug !== pageData.slug) {
                await this.ensureSlugUnique(newSlug, id);
                pageData.slug = newSlug;
            }
        }
        // If slug is not provided, keep the existing slug

        // Handle menu_id update
        if (menu_id !== undefined) {
            if (menu_id === null || menu_id === '') {
                pageData.menu = null;
            } else {
                const menu = await this.menuRepository.findOneBy({ id: menu_id });
                if (!menu) throw new NotFoundException('Menu tidak ditemukan');
                pageData.menu = menu;
            }
        }

        this.pageRepository.merge(pageData, updateData);
        return this.pageRepository.save(pageData);
    }

    async remove(id: string) {
        const result = await this.pageRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Page not found');
        return { deleted: true };
    }

    async toggleStatus(id: string) {     
        const page = await this.pageRepository.findOneBy({ id });
        if (!page) throw new NotFoundException('Page not found');
        page.status = page.status === 1 ? 0 : 1;
        return this.pageRepository.save(page);
    }

    private async ensureSlugUnique(slug: string, excludeId?: string) {
        const where: any = { slug };
        if (excludeId) {
            where.id = Not(excludeId);
        }
        const exist = await this.pageRepository.findOneBy(where);
        if (exist) {
            throw new ConflictException(`Slug '${slug}' already exists`);
        }
    }
}
