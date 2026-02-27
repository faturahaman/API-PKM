import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuskesmasInfo } from './entity/puskesmas-info.entity';
import { PuskesmasInfoService } from './puskesmas-info.service';
import { PuskesmasInfoAdminController } from './puskesmas-info.admin.controller';
import { PuskesmasInfoPublicController } from './puskesmas-info.public.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PuskesmasInfo])],
    controllers: [PuskesmasInfoAdminController, PuskesmasInfoPublicController],
    providers: [PuskesmasInfoService],
    exports: [PuskesmasInfoService],
})
export class PuskesmasInfoModule { }
