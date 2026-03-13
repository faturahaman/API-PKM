import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './entity/page.entity';
import { Menu } from '../menus/entity/menu.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';
import { RequestMetaDto } from '../common/dto/request-meta.dto';

@Injectable()
export class PagesService {
    private readonly logger = new Logger(PagesService.name);
    private pageRepository: BaseTenantRepository<Page>;
    private menuRepository: BaseTenantRepository<Menu>;

    constructor(
        @InjectRepository(Page)
        pageRepositoryNative: Repository<Page>,
        @InjectRepository(Menu)
        menuRepositoryNative: Repository<Menu>,
        private readonly tenantContextService: TenantContextService,
        private readonly logactivityService: LogactivityService,
    ) {
        this.pageRepository = new BaseTenantRepository(pageRepositoryNative, tenantContextService);
        this.menuRepository = new BaseTenantRepository(menuRepositoryNative, tenantContextService);
    }

    async create(createPageDto: CreatePageDto, image?: Express.Multer.File, document?: Express.Multer.File, requestMeta?: RequestMetaDto) {
        if (!createPageDto.title || createPageDto.title.trim() === '') {
            throw new BadRequestException('Judul halaman wajib diisi');
        }

        const { menu_id, force_replace, ...pageData } = createPageDto;

        const page = this.pageRepository.create({
            ...pageData,
            image: image ? `/uploads/pages/${image.filename}` : createPageDto.image,
            file: document ? `/uploads/pages/${document.filename}` : createPageDto.file,
        });

        if (menu_id && menu_id !== '' && menu_id !== '0' && menu_id !== null) {
            const menu = await this.menuRepository.findOneBy({ id: menu_id });
            if (!menu) throw new NotFoundException('Menu tidak ditemukan');

            // Validasi: Jika menu sudah memiliki page, tipe page baru harus SAMA dengan tipe yang sudah ada.
            const newPageType = createPageDto.type ?? 'halaman';
            const existingPages = await this.pageRepository.find({
                where: { menu: { id: menu_id } },
            });

            if (existingPages.length > 0) {
                // Menu sudah punya page - cek apakah tipe sama
                const existingType = existingPages[0].type;
                if (existingType !== newPageType) {
                    throw new BadRequestException(
                        `Menu ini sudah memiliki halaman dengan tipe "${existingType}". ` +
                        `Tidak boleh mencampur tipe halaman. Silakan pilih menu lain atau gunakan tipe yang sama.`
                    );
                }
            }

            page.menu = menu;
        } else {
            page.menu = null;
        }

        const savedPage = await this.pageRepository.save(page);

        // Log activity - CREATE
        try {
            await this.logactivityService.log({
                action: LogActivityAction.CREATE,
                module: 'PAGES',
                entity_id: savedPage.id,
                ip_address: requestMeta?.ip_address,
                user_agent: requestMeta?.user_agent,
                route: requestMeta?.route,
                method: requestMeta?.method,
                payload_after: {
                    title: savedPage.title,
                    type: savedPage.type,
                },
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return savedPage;
    }

    async findAllAdmin(search?: string, page: number = 1, limit: number = 10) {
        const query = this.pageRepository.createQueryBuilder('page');
        query.leftJoinAndSelect('page.menu', 'menu');

        if (search) {
            query.andWhere('page.title LIKE :search', { search: `%${search}%` });
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

    async findBerita(page?: number, limit?: number) {
        // Step 1: Cari semua menu yang title-nya LIKE 'berita' (case-insensitive)
        const beritaMenus = await this.menuRepository
            .createQueryBuilder('menu')
            .andWhere('LOWER(menu.title) LIKE LOWER(:keyword)', { keyword: '%berita%' })
            .getMany();

        if (beritaMenus.length === 0) return [];

        const beritaMenuIds = beritaMenus.map((m) => m.id);

        // Step 2: Cari juga child menu yang parent-nya adalah menu berita tersebut
        const childMenus = await this.menuRepository
            .createQueryBuilder('menu')
            .andWhere('menu.parent_id IN (:...ids)', { ids: beritaMenuIds })
            .getMany();

        const allMenuIds = [...beritaMenuIds, ...childMenus.map((m) => m.id)];

        // Step 3: Query pages yang menu_id-nya masuk dalam daftar allMenuIds
        const query = this.pageRepository
            .createQueryBuilder('page')
            .leftJoinAndSelect('page.menu', 'menu')
            .andWhere('menu.id IN (:...menuIds)', { menuIds: allMenuIds })
            .andWhere('page.status = :status', { status: 1 })
            .orderBy('page.createdAt', 'DESC');

        if (page !== undefined && limit !== undefined) {
            query.skip((page - 1) * limit).take(limit);
        }

        return query.getMany();
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

    // Ambil halaman aktif berdasarkan menu dengan pagination
    async findAllByMenuId(menuId: string, page: number = 1, limit: number = 10) {
        const query = this.pageRepository.createQueryBuilder('page');
        query.leftJoinAndSelect('page.menu', 'menu');
        query.andWhere('menu.id = :menuId AND page.status = 1', { menuId });
        query.orderBy('page.createdAt', 'DESC');

        const total = await query.getCount();
        query.skip((page - 1) * limit).take(limit);
        const data = await query.getMany();

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async findPublished() {
        return this.pageRepository.find({
            where: { status: 1 },
            relations: ['menu'],
            order: { createdAt: 'DESC' },
        });
    }

    async update(id: string, updatePageDto: UpdatePageDto, image?: Express.Multer.File, document?: Express.Multer.File, requestMeta?: RequestMetaDto) {
        const pageData = await this.pageRepository.findOne({
            where: { id },
            relations: ['menu'],
        });
        if (!pageData) throw new NotFoundException('Halaman tidak ditemukan');

        const { menu_id, force_replace, ...updateData } = updatePageDto;

        if (menu_id !== undefined) {
            if (menu_id === null || menu_id === '' || menu_id === '0') {
                pageData.menu = null;
            } else {
                const menu = await this.menuRepository.findOneBy({ id: menu_id });
                if (!menu) throw new NotFoundException('Menu tidak ditemukan');

                // Validasi: Jika menu sudah memiliki page, tipe page baru harus SAMA dengan tipe yang sudah ada.
                const newPageType = updateData.type ?? pageData.type ?? 'halaman';
                const existingPages = await this.pageRepository.find({
                    where: { menu: { id: menu_id } },
                });

                if (existingPages.length > 0) {
                    // Menu sudah punya page - cek apakah tipe sama (kecuali jika page yang diedit adalah page itu sendiri)
                    const otherPages = existingPages.filter(p => p.id !== id);
                    if (otherPages.length > 0) {
                        const existingType = otherPages[0].type;
                        if (existingType !== newPageType) {
                            throw new BadRequestException(
                                `Menu ini sudah memiliki halaman dengan tipe "${existingType}". ` +
                                `Tidak boleh mencampur tipe halaman. Silakan pilih menu lain atau gunakan tipe yang sama.`
                            );
                        }
                    }
                }

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
        const savedPage = await this.pageRepository.save(pageData);

        // Log activity - UPDATE
        try {
            await this.logactivityService.log({
                action: LogActivityAction.UPDATE,
                module: 'PAGES',
                entity_id: savedPage.id,
                ip_address: requestMeta?.ip_address,
                user_agent: requestMeta?.user_agent,
                route: requestMeta?.route,
                method: requestMeta?.method,
                payload_after: {
                    title: savedPage.title,
                    type: savedPage.type,
                },
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return savedPage;
    }

    async remove(id: string, requestMeta?: RequestMetaDto) {
        const pageToDelete = await this.pageRepository.findOneBy({ id });
        if (!pageToDelete) throw new NotFoundException('Halaman tidak ditemukan');

        const deletedData = {
            title: pageToDelete.title,
            type: pageToDelete.type,
        };

        const result = await this.pageRepository.delete(id);

        // Log activity - DELETE
        try {
            await this.logactivityService.log({
                action: LogActivityAction.DELETE,
                module: 'PAGES',
                entity_id: id,
                ip_address: requestMeta?.ip_address,
                user_agent: requestMeta?.user_agent,
                route: requestMeta?.route,
                method: requestMeta?.method,
                payload_before: deletedData,
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return { deleted: true };
    }

    async toggleStatus(id: string) {
        const page = await this.pageRepository.findOneBy({ id });
        if (!page) throw new NotFoundException('Halaman tidak ditemukan');
        page.status = page.status === 1 ? 0 : 1;
        return this.pageRepository.save(page);
    }

    async findOneByData(data: string) {
        const page = await this.pageRepository.findOne({ where: { title: data } });
        if (!page) throw new NotFoundException('Halaman tidak ditemukan');
        return page;
    }

    // Check if menu already has any pages linked, return all with their types
    async checkMenuLink(menuId: string) {
        if (!menuId || menuId === '' || menuId === '0' || menuId === null) {
            return null;
        }

        const pages = await this.pageRepository.find({
            where: { menu: { id: menuId } },
            relations: ['menu'],
            order: { createdAt: 'DESC' },
        });

        if (pages.length === 0) {
            return null;
        }

        return {
            hasPages: true,
            pageCount: pages.length,
            existingType: pages[0].type, // All pages should be same type
            pages: pages.map(p => ({
                id: p.id,
                title: p.title,
                type: p.type,
            })),
            menu_id: pages[0].menu ? pages[0].menu.id : null,
            menu_title: pages[0].menu ? pages[0].menu.title : null,
        };
    }
}
