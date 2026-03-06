import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Menu } from './entity/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import slugify from 'slugify';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';

@Injectable()
export class MenusService {
  private menuRepository: BaseTenantRepository<Menu>;

  constructor(
    @InjectRepository(Menu)
    menuRepositoryNative: Repository<Menu>,
    private readonly tenantContextService: TenantContextService,
  ) {
    this.menuRepository = new BaseTenantRepository(menuRepositoryNative, tenantContextService);
  }

  async create(createMenuDto: CreateMenuDto) {
    const { parent_id, title, ...menuData } = createMenuDto;

    const slug = slugify(title, { lower: true, strict: true });

    const exists = await this.menuRepository.findOne({ where: { slug } });
    if (exists) throw new BadRequestException('Slug sudah digunakan');

    const menu = this.menuRepository.create({
      ...menuData,
      title,
      slug,
    });

    if (parent_id && parent_id !== '0') {
      const parent = await this.menuRepository.findOneBy({ id: parent_id });
      if (!parent) throw new NotFoundException('Parent Menu tidak ditemukan');
      menu.parent = parent;
    }

    return this.menuRepository.save(menu);
  }

  async findBySlug(slug: string) {
    const menu = await this.menuRepository.findOne({
      where: { slug, status: 1 },
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    return menu;
  }

  async toggleStatus(id: string) {
    const menu = await this.findOne(id);
    menu.status = menu.status === 1 ? 0 : 1;
    return this.menuRepository.save(menu);
  }

  async findPublicTree() {
    const menus = await this.menuRepository.find({
      where: { status: 1 },
      order: { order: 'ASC' },
      relations: ['parent'],
    });

    return this.buildTree(menus);
  }

  private buildTree(menus: Menu[]): any[] {
    const menuMap = new Map<string, any>();

    menus.forEach((menu) => {
      menuMap.set(menu.id, {
        id: menu.id,
        title: menu.title,
        slug: menu.slug,
        type: menu.type,
        order: menu.order,
        status: menu.status,
        parent_id: menu.parent ? menu.parent.id : null,
        children: [],
      });
    });

    const rootMenus: any[] = [];

    menus.forEach((menu) => {
      const mappedMenu = menuMap.get(menu.id);

      if (menu.parent) {
        const parent = menuMap.get(menu.parent.id);
        if (parent) {
          parent.children.push(mappedMenu);
        } else {
          rootMenus.push(mappedMenu);
        }
      } else {
        rootMenus.push(mappedMenu);
      }
    });

    const sortRecursive = (items: any[]) => {
      items.sort((a, b) => a.order - b.order);
      items.forEach((item) => {
        if (item.children.length > 0) {
          sortRecursive(item.children);
        }
      });
    };

    sortRecursive(rootMenus);
    return rootMenus;
  }

  async findAllAdmin() {
    const menus = await this.menuRepository.find({
      relations: ['parent'],
      order: { order: 'ASC' },
    });

    return menus.map((menu) => ({
      ...menu,
      parent: menu.parent ? { id: menu.parent.id, title: menu.parent.title } : null,
    }));
  }

  async findOne(id: string) {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    const { parent_id, ...updateData } = updateMenuDto;

    if (parent_id !== undefined) {
      if (parent_id === null || parent_id === '0' || parent_id === '__none__') {
        menu.parent = null;
      } else {
        const parent = await this.menuRepository.findOneBy({ id: parent_id });
        if (!parent) throw new NotFoundException('Parent Menu tidak ditemukan');
        if (parent.id === id) {
          throw new BadRequestException('Menu tidak bisa menjadi parent untuk dirinya sendiri');
        }
        menu.parent = parent;
      }
    }

    if (updateData.title) {
      const slug = slugify(updateData.title, { lower: true, strict: true });
      const exists = await this.menuRepository.findOne({
        where: { slug, id: Not(id) },
      });
      if (exists) throw new BadRequestException('Slug sudah digunakan');
      menu.slug = slug;
    }

    this.menuRepository.merge(menu, updateData);
    return this.menuRepository.save(menu);
  }

  async remove(id: string) {
    const menu = await this.findOne(id);

    const children = await this.menuRepository.find({
      where: { parent: { id } },
    });

    if (children.length > 0) {
      throw new BadRequestException('Menu memiliki submenu. Hapus submenu terlebih dahulu.');
    }

    return this.menuRepository.remove(menu);
  }
}