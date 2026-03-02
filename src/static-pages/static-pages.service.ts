import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaticPage } from './entity/static-page.entity';
import { Menu } from '../menus/entity/menu.entity';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { createMulterOptions } from '../common/multer.utils';

@Injectable()
export class StaticPagesService {
    constructor(
        @InjectRepository(StaticPage)
        private staticPageRepository: Repository<StaticPage>,
        @InjectRepository(Menu)
        private menuRepository: Repository<Menu>,
    ) { }

    async create(createStaticPageDto: CreateStaticPageDto, image?: Express.Multer.File) {
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

        return this.staticPageRepository.save(staticPage);
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

    async update(id: string, updateStaticPageDto: UpdateStaticPageDto, image?: Express.Multer.File) {
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
        return this.staticPageRepository.save(staticPage);
    }

    async remove(id: string) {
        const result = await this.staticPageRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException('Halaman statis tidak ditemukan');
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
