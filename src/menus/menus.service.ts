import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Menu } from './entity/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import slugify from 'slugify';

import { TenantContextService } from '../common/tenant/tenant-context.service';
import { BaseTenantRepository } from '../common/tenant/base-tenant.repository';
import { LogactivityService } from '../logactivity/logactivity.service';
import { LogActivityAction } from '../logactivity/entity/log-activity.entity';

@Injectable()
export class MenusService {
  private readonly logger = new Logger(MenusService.name);
  private menuRepository: BaseTenantRepository<Menu>;

  constructor(
    @InjectRepository(Menu)
    menuRepositoryNative: Repository<Menu>,
    private readonly tenantContextService: TenantContextService,
    private readonly logactivityService: LogactivityService,
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

    const savedMenu = await this.menuRepository.save(menu);

    // Log activity - CREATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.CREATE,
        module: 'MENU',
        entity_id: savedMenu.id,
        payload_after: {
          title: savedMenu.title,
          slug: savedMenu.slug,
          type: savedMenu.type,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedMenu;
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

  async findAllAdmin(search?: string, page: number = 1, limit: number = 10, type?: string) {
    this.logger.log(`[findAllAdmin] Starting query. Search: ${search}, Page: ${page}, Type: ${type}`);
    this.logger.log(`[findAllAdmin] Tenant context: ${JSON.stringify(this.tenantContextService.getTenantContext())}`);

    const query = this.menuRepository.createQueryBuilder('menu');
    query.leftJoinAndSelect('menu.parent', 'parent');
    query.leftJoinAndSelect('menu.children', 'children');

    // Only get root menus (menus without parent)
    query.andWhere('menu.parent_id IS NULL');

    if (search) {
      query.andWhere('menu.title LIKE :search', { search: `%${search}%` });
    }

    if (type) {
      query.andWhere('menu.type = :type', { type });
    }

    query.orderBy('menu.order', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    this.logger.log(`[findAllAdmin] Final query: ${query.getSql()}`);

    const [data, total] = await query.getManyAndCount();

    this.logger.log(`[findAllAdmin] Found ${total} total menus, returning ${data.length} menus`);

    return {
      data: data.map((menu) => ({
        ...menu,
        parent: menu.parent ? { id: menu.parent.id, title: menu.parent.title } : null,
        parent_id: menu.parent ? menu.parent.id : null,
        children: menu.children ? menu.children.map(child => ({
          id: child.id,
          title: child.title,
          slug: child.slug,
          type: child.type,
          order: child.order,
          status: child.status,
          parent_id: child.parent ? child.parent.id : null,
          parent: child.parent ? { id: child.parent.id, title: child.parent.title } : null,
          children: [],
          createdAt: child.createdAt,
          updatedAt: child.updatedAt,
        })) : [],
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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
    const savedMenu = await this.menuRepository.save(menu);

    // Log activity - UPDATE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.UPDATE,
        module: 'MENU',
        entity_id: savedMenu.id,
        payload_after: {
          title: savedMenu.title,
          slug: savedMenu.slug,
          type: savedMenu.type,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return savedMenu;
  }

  async remove(id: string) {
    const menu = await this.findOne(id);

    const children = await this.menuRepository.find({
      where: { parent: { id } },
    });

    if (children.length > 0) {
      throw new BadRequestException('Menu memiliki submenu. Hapus submenu terlebih dahulu.');
    }

    const deletedData = {
      title: menu.title,
      slug: menu.slug,
      type: menu.type,
    };

    const result = await this.menuRepository.remove(menu);

    // Log activity - DELETE
    try {
      await this.logactivityService.log({
        action: LogActivityAction.DELETE,
        module: 'MENU',
        entity_id: id,
        payload_before: deletedData,
      });
    } catch (error) {
      this.logger.warn(`Failed to log activity: ${error.message}`);
    }

    return result;
  }
}