import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusService } from './menus.service';
import { MenusPublicController } from './menus.public.controller';
import { MenusAdminController } from './menus.admin.controller';
import { Menu } from './entity/menu.entity';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    LogactivityModule,
  ],
  controllers: [MenusPublicController, MenusAdminController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule { }
