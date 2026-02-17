import { Controller, Get } from '@nestjs/common';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusPublicController {
  constructor(private readonly menusService: MenusService) { }

  @Get()
  findPublicTree() {
    return this.menusService.findPublicTree();
  }
}