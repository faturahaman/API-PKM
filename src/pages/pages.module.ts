import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesService } from './pages.service';
import { PagesAdminController } from './pages.admin.controller';
import { PagesPublicController } from './pages.public.controller';
import { Page } from './entity/page.entity';
import { Menu } from '../menus/entity/menu.entity';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Page, Menu]),
        LogactivityModule,
    ],
    controllers: [PagesAdminController, PagesPublicController],
    providers: [PagesService],
    exports: [PagesService],
})
export class PagesModule { }
