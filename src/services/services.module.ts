import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AdminServicesController } from './services.admin.controller';
import { PublicServicesController } from './service.public.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServiceFlow } from './entities/service-flow.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Service, ServiceFlow])],
    controllers: [AdminServicesController, PublicServicesController],
    providers: [ServicesService],
})
export class ServicesModule {  }