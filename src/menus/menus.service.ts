import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Menu } from './entity/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) { }

  async create(createMenuDto: CreateMenuDto) {
    const menu = this.menuRepository.create(createMenuDto);

    if (createMenuDto.parentId) {
      const parent = await this.menuRepository.findOneBy({ id: createMenuDto.parentId });
      if (!parent) throw new NotFoundException('Parent Menu tidak ditemukan');
      menu.parent = parent;
    }

    return this.menuRepository.save(menu);
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
        // Hapus circular reference parent object agar response bersih, simpan parentId jika perlu
        parentId: menu.parent ? menu.parent.id : null,
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

    if (updateMenuDto.parentId !== undefined) {
      if (updateMenuDto.parentId === null) {
        menu.parent = null;
      } else {
        const parent = await this.menuRepository.findOneBy({ id: updateMenuDto.parentId });
        if (!parent) throw new NotFoundException('Parent Menu tidak ditemukan');
        // Prevent circular dependency: parent cannot be itself
        if (parent.id === id) {
          throw new Error('Menu tidak bisa menjadi parent untuk dirinya sendiri');
        }
        menu.parent = parent;
      }
    }

    const updatedMenu = this.menuRepository.merge(menu, updateMenuDto);
    return this.menuRepository.save(updatedMenu);
  }

  async remove(id: string) {
    const menu = await this.findOne(id);
    // Karena CASCADE diset di entity (onDelete: 'CASCADE'), children akan ikut terhapus atau set null tergantung konfigurasi.
    // Di entity 'menu.entity.ts': @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'CASCADE' })
    // Ini berarti jika Parent dihapus, record ini (Child) akan terhapus.
    // TAPI, logic TypeORM onDelete: 'CASCADE' ada di sisi Child (ManyToOne).
    // Jika kita hapus Menu A, maka semua Menu yang punya parent A akan terhapus.
    return this.menuRepository.remove(menu);
  }
}