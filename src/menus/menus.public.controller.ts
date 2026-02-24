import { Controller, Get, Param } from '@nestjs/common';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusPublicController {
  constructor(private readonly menusService: MenusService) { }

  @Get()
  findPublicTree() {
    return this.menusService.findPublicTree();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.menusService.findBySlug(slug);
  }
}