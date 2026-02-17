import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesService } from './pages.service';
import { PagesAdminController } from './pages.admin.controller';
import { PagesPublicController } from './pages.public.controller';
import { Page } from './entity/page.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Page])],
    controllers: [PagesAdminController, PagesPublicController],
    providers: [PagesService],
    exports: [PagesService],
})
export class PagesModule { }
