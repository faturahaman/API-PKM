import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Menu } from './entity/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import slugify from 'slugify';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) { }

  async create(createMenuDto: CreateMenuDto) {
    const { parent_id, title, ...menuData } = createMenuDto;

    const slug = slugify(title, { lower: true, strict: true });

    const exists = await this.menuRepository.findOne({ where: { slug } });
    if (exists) throw new BadRequestException('Slug sudah digunakan');

    const menu = this.menuRepository.create({
      ...menuData,
      title,
      slug
    });

    if (parent_id) {
      const parent = await this.menuRepository.findOneBy({ id: parent_id });
      if (!parent) throw new NotFoundException('Parent Menu tidak ditemukan');
      menu.parent = parent;
    }

    return this.menuRepository.save(menu);
  }

  async findBySlug(slug: string) {
    const menu = await this.menuRepository.findOne({
      where: { slug, status: 1 }
    })
    if (!menu) throw new NotFoundException('Menu tidak ditemukan')
    return menu
  }

  async toggleStatus(id: string) {
    const menu = await this.findOne(id)
    menu.status = menu.status === 1 ? 0 : 1
    return this.menuRepository.save(menu)
  }

  async findPublicTree() {
    // Ambil semua menu dengan relasi parent untuk mempermudah grouping
    const allMenus = await this.menuRepository.find({
      relations: ['parent'],
      order: { order: 'ASC' },
    });

    return this.buildTree(allMenus);
  }

  private buildTree(menus: Menu[]): any[] {
    const menuMap = new Map<string, any>();

    // 1. Init map untuk setiap item, siapkan array children
    menus.forEach(menu => {
      menuMap.set(menu.id, {
        ...menu,
        children: [],
        // Hapus circular reference parent object agar response bersih, simpan parent_id jika perlu
        parent_id: menu.parent ? menu.parent.id : null,
        parent: undefined
      });
    });

    const rootMenus: any[] = [];

    // 2. Susun hierarchy
    menus.forEach(menu => {
      const mappedMenu = menuMap.get(menu.id);

      if (menu.parent) {
        const parent = menuMap.get(menu.parent.id);
        if (parent) {
          parent.children.push(mappedMenu);
        } else {
          // Fallback jika parent tidak ada di set (misal soft delete atau error data), jadikan root
          rootMenus.push(mappedMenu);
        }
      } else {
        rootMenus.push(mappedMenu);
      }
    });

    // 3. Recursive sort
    const sortRecursive = (items: any[]) => {
      items.sort((a, b) => a.order - b.order);
      items.forEach(item => {
        if (item.children.length > 0) {
          sortRecursive(item.children);
        }
      });
    };

    sortRecursive(rootMenus);

    return rootMenus;
  }

  async findAllAdmin() {
    // Flat list dengan info parent, cocok untuk tabel admin
    const menus = await this.menuRepository.find({
      relations: ['parent'],
      order: { order: 'ASC' },
    });

    // Map agar parent cuma tampil nama/id saja biar tidak heavy
    return menus.map(menu => ({
      ...menu,
      parent: menu.parent ? { id: menu.parent.id, title: menu.parent.title } : null
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
      if (parent_id === null) {
        menu.parent = null;
      } else {
        const parent = await this.menuRepository.findOneBy({ id: parent_id });
        if (!parent) throw new NotFoundException('Parent Menu tidak ditemukan');
        // Prevent circular dependency: parent cannot be itself
        if (parent.id === id) {
          throw new Error('Menu tidak bisa menjadi parent untuk dirinya sendiri');
        }
        menu.parent = parent;
      }
    }

    if (updateData.title) {
      const slug = slugify(updateData.title, { lower: true, strict: true });

      const exists = await this.menuRepository.findOne({
        where: { slug, id: Not(id) }
      });

      if (exists) throw new BadRequestException('Slug sudah digunakan');

      menu.slug = slug;
    }

    this.menuRepository.merge(menu, updateData);
    return this.menuRepository.save(menu);
  }

  async remove(id: string) {
    const menu = await this.findOne(id);
    return this.menuRepository.remove(menu);
  }
}