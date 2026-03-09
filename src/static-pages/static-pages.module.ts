import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticPagesService } from './static-pages.service';
import { StaticPagesAdminController } from './static-pages.admin.controller';
import { StaticPagesPublicController } from './static-pages.public.controller';
import { StaticPage } from './entity/static-page.entity';
import { Menu } from '../menus/entity/menu.entity';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([StaticPage, Menu]),
        LogactivityModule,
    ],
    controllers: [StaticPagesAdminController, StaticPagesPublicController],
    providers: [StaticPagesService],
    exports: [StaticPagesService],
})
export class StaticPagesModule { }
