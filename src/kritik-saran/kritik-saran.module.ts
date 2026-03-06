import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KritikSaran } from './entity/kritik-saran.entity';
import { KritikSaranService } from './kritik-saran.service';
import { KritikSaranController } from './kritik-saran.controller';
import { TenantContextService } from '../common/tenant/tenant-context.service';

@Module({
    imports: [TypeOrmModule.forFeature([KritikSaran])],
    controllers: [KritikSaranController],
    providers: [KritikSaranService, TenantContextService],
    exports: [KritikSaranService],
})
export class KritikSaranModule { }
