import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantContextService } from './tenant-context.service';
import { TenantInterceptor } from './tenant.interceptor';
import { TenantGuard } from './tenant.guard';
import { TenantMiddleware } from './tenant.middleware';
import { Puskesmas } from '../../puskesmas/entity/puskesmas.entity';

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
        {
            provide: APP_GUARD,
            useExisting: TenantGuard,
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
