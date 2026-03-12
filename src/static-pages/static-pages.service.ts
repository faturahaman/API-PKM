import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaticPage } from './entity/static-page.entity';
import { Menu } from '../menus/entity/menu.entity';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { createMulterOptions } from '../common/multer.utils';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';
import { RequestMetaDto } from '../common/dto/request-meta.dto';

@Injectable()
export class StaticPagesService {
    private readonly logger = new Logger(StaticPagesService.name);
    private staticPageRepository: BaseTenantRepository<StaticPage>;
    private menuRepository: BaseTenantRepository<Menu>;

    constructor(
        @InjectRepository(StaticPage)
        staticPageRepositoryNative: Repository<StaticPage>,
        @InjectRepository(Menu)
        menuRepositoryNative: Repository<Menu>,
        private readonly tenantContextService: TenantContextService,
        private readonly logactivityService: LogactivityService,
    ) {
        this.staticPageRepository = new BaseTenantRepository(staticPageRepositoryNative, tenantContextService);
        this.menuRepository = new BaseTenantRepository(menuRepositoryNative, tenantContextService);
    }

    async create(createStaticPageDto: CreateStaticPageDto, image?: Express.Multer.File, requestMeta?: RequestMetaDto) {
        if (!createStaticPageDto.title || createStaticPageDto.title.trim() === '') {
            throw new BadRequestException('Judul halaman wajib diisi');
        }

        const { menu_id, force_replace, ...pageData } = createStaticPageDto;

        const staticPage = this.staticPageRepository.create({
            ...pageData,
        });

        if (menu_id && menu_id !== '' && menu_id !== '0' && menu_id !== null) {
            const menu = await this.menuRepository.findOneBy({ id: menu_id });
            if (!menu) throw new NotFoundException('Menu tidak ditemukan');

            // Validasi: 1 menu hanya boleh terhubung ke 1 static page.
            const existing = await this.staticPageRepository.findOne({
                where: { menu: { id: menu_id } },
                relations: ['menu'],
            });
            if (existing) {
                if (force_replace) {
                    existing.menu = null;
                    await this.staticPageRepository.save(existing);
                } else {
                    throw new BadRequestException(
                        `Menu ini sudah terhubung ke halaman statis (id: ${existing.id}, title: ${existing.title}). ` +
                        `Pilih opsi ganti halaman untuk melanjutkan.`
                    );
                }
            }

            staticPage.menu = menu;
        } else {
            staticPage.menu = null;
        }

        const savedPage = await this.staticPageRepository.save(staticPage);

        // Log activity - CREATE
        try {
            await this.logactivityService.log({
                action: LogActivityAction.CREATE,
                module: 'STATIC_PAGES',
                entity_id: savedPage.id,
                ip_address: requestMeta?.ip_address,
                user_agent: requestMeta?.user_agent,
                route: requestMeta?.route,
                method: requestMeta?.method,
                payload_after: {
                    title: savedPage.title,
                },
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return savedPage;
    }

    async findAllAdmin(search?: string, page: number = 1, limit: number = 10) {
        const query = this.staticPageRepository.createQueryBuilder('staticPage');
        query.leftJoinAndSelect('staticPage.menu', 'menu');

        if (search) {
            query.where('staticPage.title LIKE :search', { search: `%${search}%` });
        }

        query.orderBy('staticPage.createdAt', 'DESC');
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

    async findOne(id: string) {
        const staticPage = await this.staticPageRepository.findOne({
            where: { id },
            relations: ['menu'],
        });
        if (!staticPage) throw new NotFoundException('Halaman statis tidak ditemukan');
        return {
            ...staticPage,
            menu_id: staticPage.menu ? staticPage.menu.id : null,
            menu: staticPage.menu ? { id: staticPage.menu.id, title: staticPage.menu.title } : null,
        };
    }

    async findAll() {
        return this.staticPageRepository.find({
            relations: ['menu'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByMenuId(menuId: string) {
        const staticPage = await this.staticPageRepository.findOne({
            where: { menu: { id: menuId } },
            relations: ['menu'],
        });
        if (!staticPage) throw new NotFoundException('Halaman statis tidak ditemukan');
        return {
            ...staticPage,
            menu_id: staticPage.menu ? staticPage.menu.id : null,
            menu: staticPage.menu ? { id: staticPage.menu.id, title: staticPage.menu.title } : null,
        };
    }

    async update(id: string, updateStaticPageDto: UpdateStaticPageDto, image?: Express.Multer.File, requestMeta?: RequestMetaDto) {
        const staticPage = await this.staticPageRepository.findOne({
            where: { id },
            relations: ['menu'],
        });
        if (!staticPage) throw new NotFoundException('Halaman statis tidak ditemukan');

        const { menu_id, force_replace, ...updateData } = updateStaticPageDto;

        if (menu_id !== undefined) {
            if (menu_id === null || menu_id === '' || menu_id === '0') {
                staticPage.menu = null;
            } else {
                const menu = await this.menuRepository.findOneBy({ id: menu_id });
                if (!menu) throw new NotFoundException('Menu tidak ditemukan');

                // Validasi: 1 menu hanya boleh terhubung ke 1 static page.
                const existing = await this.staticPageRepository.findOne({
                    where: { menu: { id: menu_id } },
                    relations: ['menu'],
                });

                // Jika existing adalah static page yang sama, aman.
                if (existing && existing.id !== staticPage.id) {
                    if (force_replace) {
                        existing.menu = null;
                        await this.staticPageRepository.save(existing);
                    } else {
                        throw new BadRequestException(
                            `Menu ini sudah terhubung ke halaman statis (id: ${existing.id}, title: ${existing.title}). ` +
                            `Pilih opsi ganti halaman untuk melanjutkan.`
                        );
                    }
                }

                staticPage.menu = menu;
            }
        }

        this.staticPageRepository.merge(staticPage, updateData);
        const savedPage = await this.staticPageRepository.save(staticPage);

        // Log activity - UPDATE
        try {
            await this.logactivityService.log({
                action: LogActivityAction.UPDATE,
                module: 'STATIC_PAGES',
                entity_id: savedPage.id,
                ip_address: requestMeta?.ip_address,
                user_agent: requestMeta?.user_agent,
                route: requestMeta?.route,
                method: requestMeta?.method,
                payload_after: {
                    title: savedPage.title,
                },
            });
        } catch (error) {
            this.logger.warn(`Failed to log activity: ${error.message}`);
        }

        return savedPage;
    }

    async remove(id: string, requestMeta?: RequestMetaDto) {
        const pageToDelete = await this.staticPageRepository.findOneBy({ id });

        const deletedData = pageToDelete ? {
            title: pageToDelete.title,
        } : {};

        const result = await this.staticPageRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Halaman statis tidak ditemukan');

        // Log activity - DELETE
        try {
            await this.logactivityService.log({
                action: LogActivityAction.DELETE,
                module: 'STATIC_PAGES',
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

    // Check if menu already has a static page linked
    async checkMenuLink(menuId: string) {
        if (!menuId || menuId === '' || menuId === '0' || menuId === null) {
            return null;
        }

        const staticPage = await this.staticPageRepository.findOne({
            where: { menu: { id: menuId } },
            relations: ['menu'],
        });

        if (!staticPage) {
            return null;
        }

        return {
            id: staticPage.id,
            title: staticPage.title,
            menu_id: staticPage.menu ? staticPage.menu.id : null,
            menu_title: staticPage.menu ? staticPage.menu.title : null,
        };
    }
}
