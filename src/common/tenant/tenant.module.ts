import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'; // Tambahin ini
import { TenantContextService } from './tenant-context.service';
import { TenantInterceptor } from './tenant.interceptor';
import { TenantGuard } from './tenant.guard';
import { TenantMiddleware } from './tenant.middleware';
import { Puskesmas } from '../../puskesmas/entity/puskesmas.entity'; // Pastiin path entity bener

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Puskesmas]),
    ],
    providers: [
        TenantContextService,
        TenantInterceptor,
        TenantGuard,
        TenantMiddleware,
        {
            provide: APP_INTERCEPTOR,
            useExisting: TenantInterceptor,
        },
    ],
    exports: [
        TenantContextService,
        TenantInterceptor,
        TenantGuard,
        TypeOrmModule,
    ],
})
export class TenantModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TenantMiddleware).forRoutes('*');
    }
}