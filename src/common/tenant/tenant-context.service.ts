import { Injectable, Scope, ForbiddenException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContextData {
    tenantId: string | null;
    userId: string;
    role: string;
    isSuperAdmin: boolean;
}

@Injectable({ scope: Scope.DEFAULT })
export class TenantContextService {
    // Pakai default value kosong biar gampang di-update nanti
    private static readonly storage = new AsyncLocalStorage<TenantContextData>();

    // Ini dipanggil di Middleware (di awal banget)
    runWithContext(next: () => any): any {
        const initialData: TenantContextData = {
            tenantId: null, userId: 'public', role: 'public', isSuperAdmin: false
        };
        return TenantContextService.storage.run(initialData, next);
    }

    // Ini dipanggil di Interceptor buat ngisi datanya
    updateContext(data: Partial<TenantContextData>) {
        const store = TenantContextService.storage.getStore();
        if (store) {
            Object.assign(store, data); // Timpa data lama dengan data baru
        }
    }

    getTenantContext(): TenantContextData | null {
        return TenantContextService.storage.getStore() || null;
    }

    getTenantId(): string | null {
        return this.getTenantContext()?.tenantId ?? null;
    }

    getUserId(): string {
        return this.getTenantContext()?.userId ?? 'public';
    }

    isSuperAdmin(): boolean {
        return this.getTenantContext()?.isSuperAdmin ?? false;
    }

    requireTenantContext() {
        if (!this.getTenantId() && !this.isSuperAdmin()) {
            throw new ForbiddenException('Tenant context is required. Missing puskesmas_id.');
        }
    }
}