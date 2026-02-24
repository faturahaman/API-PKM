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
    // Injeksi repository menu
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) { }

  // Membuat menu baru
  async create(createMenuDto: CreateMenuDto) {
    const { parent_id, title, ...menuData } = createMenuDto;

    // Generate slug otomatis: huruf kecil, tanpa spasi (diganti strip)
    const slug = slugify(title, { lower: true, strict: true });

    // Pastikan slug tidak duplikat
    const exists = await this.menuRepository.findOne({ where: { slug } });
    if (exists) throw new BadRequestException('Slug sudah digunakan');

    const menu = this.menuRepository.create({
      ...menuData,
      title,
      slug,
    });

    // Jika ada parent_id, hubungkan sebagai submenu
    if (parent_id && parent_id !== '0') {
      const parent = await this.menuRepository.findOneBy({ id: parent_id });
      if (!parent) throw new NotFoundException('Parent Menu tidak ditemukan');
      menu.parent = parent;
    }

    return this.menuRepository.save(menu);
  }

  // Mengambil menu berdasarkan slug (untuk publik)
  async findBySlug(slug: string) {
    const menu = await this.menuRepository.findOne({
      where: { slug, status: 1 },
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    return menu;
  }

  // Mengubah status aktif/nonaktif menu
  async toggleStatus(id: string) {
    const menu = await this.findOne(id);
    menu.status = menu.status === 1 ? 0 : 1;
    return this.menuRepository.save(menu);
  }

  // Mengambil struktur menu pohon untuk publik
  async findPublicTree() {
    const allMenus = await this.menuRepository.find({
      relations: ['parent'],
      order: { order: 'ASC' },
    });

    return this.buildTree(allMenus);
  }

  // Fungsi helper untuk menyusun hierarchy menu
  private buildTree(menus: Menu[]): any[] {
    const menuMap = new Map<string, any>();

    menus.forEach((menu) => {
      menuMap.set(menu.id, {
        ...menu,
        children: [],
        parent_id: menu.parent ? menu.parent.id : null,
        parent: undefined,
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

  // Mengambil semua menu untuk kebutuhan admin
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

  // Mengambil satu menu berdasarkan ID
  async findOne(id: string) {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    return menu;
  }

  // Memperbarui data menu
  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    const { parent_id, ...updateData } = updateMenuDto;

    // Update parent jika ada perubahan
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

    // Update slug jika judul berubah
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

  // Menghapus menu
  async remove(id: string) {
    const menu = await this.findOne(id);
    return this.menuRepository.remove(menu);
  }
}