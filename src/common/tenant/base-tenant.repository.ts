import {
    Repository,
    SelectQueryBuilder,
    FindManyOptions,
    FindOneOptions,
    DeepPartial,
    SaveOptions,
    FindOptionsWhere,
    ObjectLiteral,
    DeleteResult,
    UpdateResult
} from 'typeorm';
import { TenantContextService } from './tenant-context.service';
import { ForbiddenException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

export class BaseTenantRepository<T extends ObjectLiteral> {
    private readonly logger = new Logger(BaseTenantRepository.name);

    constructor(
        public readonly repository: Repository<T>,
        protected readonly tenantContextService: TenantContextService,
    ) { }

    protected getTenantIdOrThrow(allowNullForPublic: boolean = false): string | null {
        const context = this.tenantContextService.getTenantContext();
        if (!context) {
            // No context at all - this is likely a public/global endpoint
            if (allowNullForPublic) {
                return null;
            }
            throw new ForbiddenException('Tenant context is required. No request context found.');
        }

        const tenantId = this.tenantContextService.getTenantId();
        const isSuperAdmin = this.tenantContextService.isSuperAdmin();

        // If Super Admin has switched to a specific tenant (active_tenant), filter by that tenant
        // If Super Admin has no active_tenant (null), they can access all data
        // For Operators, they can only access their own puskesmas
        if (isSuperAdmin) {
            // Super Admin can access all data (even without active_tenant)
            // They can also filter by specific tenant if active_tenant is set
            return tenantId; // Returns tenantId if set, null if not (both OK for Super Admin)
        }

        if (!tenantId) {
            // Non-Super Admin users MUST have a tenantId
            if (allowNullForPublic) {
                return null; // Allow null for public routes
            }
            throw new ForbiddenException('Tenant context is required for this operation. Missing puskesmas_id.');
        }

        return tenantId;
    }

    createQueryBuilder(alias?: string): SelectQueryBuilder<T> {
        const qb = this.repository.createQueryBuilder(alias);

        // Debug logging
        const context = this.tenantContextService.getTenantContext();
        this.logger.debug(`[BaseTenantRepo] createQueryBuilder called. Context: ${JSON.stringify(context)}`);

        // For public queries, try to get tenant but don't fail
        try {
            const tenantId = this.getTenantIdOrThrow(true); // allowFallback = true
            this.logger.debug(`[BaseTenantRepo] tenantId from getTenantIdOrThrow: ${tenantId}`);

            if (tenantId) {
                if (alias) {
                    qb.andWhere(`${alias}.puskesmas_id = :tenantId`, { tenantId });
                } else {
                    qb.andWhere(`puskesmas_id = :tenantId`, { tenantId });
                }
                this.logger.debug(`[BaseTenantRepo] Applied tenant filter: puskesmas_id = ${tenantId}`);
            } else {
                // No tenantId and not super admin - this is a security issue!
                const isSuperAdmin = this.tenantContextService.isSuperAdmin();
                if (!isSuperAdmin) {
                    this.logger.error(`[BaseTenantRepo] SECURITY: No tenantId for non-super-admin - query will return empty`);
                    // Return query that will return empty results
                    if (alias) {
                        qb.andWhere('1 = 0'); // Always false condition
                    } else {
                        qb.andWhere('1 = 0');
                    }
                } else {
                    this.logger.warn(`[BaseTenantRepo] Super Admin accessing all data`);
                }
            }
        } catch (e) {
            this.logger.warn(`[BaseTenantRepo] Exception in createQueryBuilder: ${e.message} - allowing public access (no filter)`);
            // No tenant context - allow public access (no filter)
            // This is expected for localhost without subdomain
        }

        return qb;
    }

    async find(options?: FindManyOptions<T>): Promise<T[]> {
        const context = this.tenantContextService.getTenantContext();
        const tenantId = this.getTenantIdOrThrow(true);

        if (!tenantId && !context?.isSuperAdmin) {
            this.logger.warn('[BaseTenantRepo] No tenant context - returning empty array for safety');
            return [];
        }
        return this.repository.find(this.applyTenantFilter(options, true));
    }

    async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
        const context = this.tenantContextService.getTenantContext();
        const tenantId = this.getTenantIdOrThrow(true);

        if (!tenantId && !context?.isSuperAdmin) {
            this.logger.warn('[BaseTenantRepo] No tenant context - returning empty data for safety');
            return [[], 0];
        }
        return this.repository.findAndCount(this.applyTenantFilter(options, true));
    }

    async findOne(options: FindOneOptions<T>): Promise<T | null> {
        const context = this.tenantContextService.getTenantContext();
        const tenantId = this.getTenantIdOrThrow(true);

        if (!tenantId && !context?.isSuperAdmin) {
            return null;
        }
        return this.repository.findOne(this.applyTenantFilter(options, true));
    }

    async findOneBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null> {
        const context = this.tenantContextService.getTenantContext();
        const tenantId = this.getTenantIdOrThrow(true);

        if (!tenantId && !context?.isSuperAdmin) {
            return null;
        }
        return this.repository.findOneBy(this.applyTenantWhere(where, true));
    }

    async count(options?: FindManyOptions<T>): Promise<number> {
        const context = this.tenantContextService.getTenantContext();
        const tenantId = this.getTenantIdOrThrow(true);

        if (!tenantId && !context?.isSuperAdmin) {
            return 0;
        }
        return this.repository.count(this.applyTenantFilter(options, true));
    }

    create(entityLike: DeepPartial<T>): T {
        const entity = this.repository.create(entityLike);
        const tenantId = this.tenantContextService.getTenantId();
        if (tenantId) {
            (entity as any).puskesmas_id = tenantId;
        }
        return entity;
    }

    async save(entityOrEntities: any, options?: SaveOptions): Promise<any> {
        const tenantId = this.tenantContextService.getTenantId();

        const setTenant = (e: any) => {
            if (tenantId && !e.puskesmas_id) {
                e.puskesmas_id = tenantId;
            }
            return e;
        };

        if (Array.isArray(entityOrEntities)) {
            return this.repository.save(entityOrEntities.map(setTenant), options);
        }
        return this.repository.save(setTenant(entityOrEntities), options);
    }

    async preload(entityLike: DeepPartial<T>): Promise<T | undefined> {
        const tenantId = this.tenantContextService.getTenantId();
        const entity = await this.repository.preload(entityLike);

        if (entity && tenantId && (entity as any).puskesmas_id && (entity as any).puskesmas_id !== tenantId) {
            return undefined;
        }

        return entity;
    }

    merge(mergeIntoEntity: T, ...entityLikes: DeepPartial<T>[]): T {
        return this.repository.merge(mergeIntoEntity, ...entityLikes);
    }

    async update(criteria: string | string[] | number | number[] | Date | Date[] | FindOptionsWhere<T>, partialEntity: any): Promise<UpdateResult> {
        const tenantId = this.getTenantIdOrThrow();

        // Never allow global updates - must have valid tenant context
        if (!tenantId) {
            throw new ForbiddenException('Tenant context is required for UPDATE operations. Missing puskesmas_id.');
        }

        // Handle different types of criteria
        if (typeof criteria === 'object' && !Array.isArray(criteria) && !(criteria instanceof Date)) {
            // It's a FindOptionsWhere object - need to extract keys properly
            const qb = this.repository.createQueryBuilder();

            // Build WHERE clause from criteria keys
            const whereClauses: string[] = [];
            const params: any = {};

            for (const [key, value] of Object.entries(criteria)) {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    // Handle special operators like In, MoreThan, LessThan, etc.
                    if ('in' in value && Array.isArray(value.in)) {
                        // Handle In operator
                        const paramName = `${key}In`;
                        whereClauses.push(`${key} IN (:...${paramName})`);
                        params[paramName] = value.in;
                    } else if ('eq' in value) {
                        whereClauses.push(`${key} = :${key}Eq`);
                        params[`${key}Eq`] = value.eq;
                    } else if ('ne' in value) {
                        whereClauses.push(`${key} != :${key}Ne`);
                        params[`${key}Ne`] = value.ne;
                    } else if ('lt' in value) {
                        whereClauses.push(`${key} < :${key}Lt`);
                        params[`${key}Lt`] = value.lt;
                    } else if ('lte' in value) {
                        whereClauses.push(`${key} <= :${key}Lte`);
                        params[`${key}Lte`] = value.lte;
                    } else if ('gt' in value) {
                        whereClauses.push(`${key} > :${key}Gt`);
                        params[`${key}Gt`] = value.gt;
                    } else if ('gte' in value) {
                        whereClauses.push(`${key} >= :${key}Gte`);
                        params[`${key}Gte`] = value.gte;
                    } else if ('like' in value) {
                        whereClauses.push(`${key} LIKE :${key}Like`);
                        params[`${key}Like`] = value.like;
                    } else if ('isNull' in value) {
                        whereClauses.push(value.isNull ? `${key} IS NULL` : `${key} IS NOT NULL`);
                    }
                } else {
                    // Direct value
                    whereClauses.push(`${key} = :${key}Value`);
                    params[`${key}Value`] = value;
                }
            }

            // Add tenant filter
            whereClauses.push('puskesmas_id = :tenantId');
            params['tenantId'] = tenantId;

            if (whereClauses.length > 0) {
                qb.where(whereClauses.join(' AND '), params);
            }

            // Add tenantId to update payload
            partialEntity.puskesmas_id = tenantId;

            return qb.update(partialEntity).execute();
        } else {
            // Simple criteria (id or ids)
            const qb = this.repository.createQueryBuilder();

            // Add tenant filter
            qb.where('puskesmas_id = :tenantId', { tenantId });

            if (Array.isArray(criteria)) {
                qb.andWhere('id IN (:...ids)', { ids: criteria });
            } else {
                qb.andWhere('id = :id', { id: criteria });
            }

            // Add tenantId to update payload
            partialEntity.puskesmas_id = tenantId;

            return qb.update(partialEntity).execute();
        }
    }

    async delete(criteria: string | string[] | number | number[] | Date | Date[] | FindOptionsWhere<T>): Promise<DeleteResult> {
        const tenantId = this.getTenantIdOrThrow();

        // Never allow global deletes - must have valid tenant context
        if (!tenantId) {
            throw new ForbiddenException('Tenant context is required for DELETE operations. Missing puskesmas_id.');
        }

        // Handle different types of criteria
        if (typeof criteria === 'object' && !Array.isArray(criteria) && !(criteria instanceof Date)) {
            // It's a FindOptionsWhere object - need to extract keys properly
            const qb = this.repository.createQueryBuilder();

            // Build WHERE clause from criteria keys
            const whereClauses: string[] = [];
            const params: any = {};

            for (const [key, value] of Object.entries(criteria)) {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    // Handle special operators like In, MoreThan, LessThan, etc.
                    if ('in' in value && Array.isArray(value.in)) {
                        // Handle In operator
                        const paramName = `${key}In`;
                        whereClauses.push(`${key} IN (:...${paramName})`);
                        params[paramName] = value.in;
                    } else if ('eq' in value) {
                        whereClauses.push(`${key} = :${key}Eq`);
                        params[`${key}Eq`] = value.eq;
                    } else if ('ne' in value) {
                        whereClauses.push(`${key} != :${key}Ne`);
                        params[`${key}Ne`] = value.ne;
                    } else if ('lt' in value) {
                        whereClauses.push(`${key} < :${key}Lt`);
                        params[`${key}Lt`] = value.lt;
                    } else if ('lte' in value) {
                        whereClauses.push(`${key} <= :${key}Lte`);
                        params[`${key}Lte`] = value.lte;
                    } else if ('gt' in value) {
                        whereClauses.push(`${key} > :${key}Gt`);
                        params[`${key}Gt`] = value.gt;
                    } else if ('gte' in value) {
                        whereClauses.push(`${key} >= :${key}Gte`);
                        params[`${key}Gte`] = value.gte;
                    } else if ('like' in value) {
                        whereClauses.push(`${key} LIKE :${key}Like`);
                        params[`${key}Like`] = value.like;
                    } else if ('isNull' in value) {
                        whereClauses.push(value.isNull ? `${key} IS NULL` : `${key} IS NOT NULL`);
                    }
                } else {
                    // Direct value
                    whereClauses.push(`${key} = :${key}Value`);
                    params[`${key}Value`] = value;
                }
            }

            // Add tenant filter
            whereClauses.push('puskesmas_id = :tenantId');
            params['tenantId'] = tenantId;

            if (whereClauses.length > 0) {
                qb.where(whereClauses.join(' AND '), params);
            }

            return qb.delete().execute();
        } else {
            // Simple criteria (id or ids)
            const qb = this.repository.createQueryBuilder();

            // Add tenant filter
            qb.where('puskesmas_id = :tenantId', { tenantId });

            if (Array.isArray(criteria)) {
                qb.andWhere('id IN (:...ids)', { ids: criteria });
            } else {
                qb.andWhere('id = :id', { id: criteria });
            }

            return qb.delete().execute();
        }
    }

    async remove(entityOrEntities: any, options?: SaveOptions): Promise<any> {
        const tenantId = this.getTenantIdOrThrow();

        // Never allow global removes - must have valid tenant context
        if (!tenantId) {
            throw new ForbiddenException('Tenant context is required for REMOVE operations. Missing puskesmas_id.');
        }

        // Apply tenant filtering by using query builder to find entities
        // This ensures we only remove entities belonging to the current tenant
        if (Array.isArray(entityOrEntities)) {
            const ids = entityOrEntities.map((e: any) => e.id);
            if (ids.length === 0) return entityOrEntities;

            const qb = this.repository.createQueryBuilder('entity')
                .andWhere('entity.id IN (:...ids)', { ids })
                .andWhere('entity.puskesmas_id = :tenantId', { tenantId });

            const entitiesToRemove = await qb.getMany();
            return this.repository.remove(entitiesToRemove, options);
        } else {
            const entity = entityOrEntities;
            const qb = this.repository.createQueryBuilder('entity')
                .andWhere('entity.id = :id', { id: entity.id })
                .andWhere('entity.puskesmas_id = :tenantId', { tenantId });

            const entityToRemove = await qb.getOne();
            if (!entityToRemove) {
                throw new ForbiddenException('Entity not found or does not belong to your puskesmas.');
            }
            return this.repository.remove(entityToRemove, options);
        }
    }

    private applyTenantFilter(options?: FindManyOptions<T> | FindOneOptions<T>, allowFallback: boolean = false): any {
        try {
            const tenantId = this.getTenantIdOrThrow(allowFallback);
            if (!tenantId) return options || {};

            const newOptions = { ...(options || {}) };
            newOptions.where = this.applyTenantWhere(newOptions.where);
            return newOptions;
        } catch (e) {
            if (allowFallback) {
                // Return unfiltered options for public queries
                return options || {};
            }
            throw e;
        }
    }

    private applyTenantWhere(where?: FindOptionsWhere<T> | FindOptionsWhere<T>[], allowFallback: boolean = false): any {
        try {
            const tenantId = this.getTenantIdOrThrow(allowFallback);
            if (!tenantId) return where || {};

            if (Array.isArray(where)) {
                return where.map(w => ({ ...w, puskesmas_id: tenantId }));
            }
            return { ...(where || {}), puskesmas_id: tenantId };
        } catch (e) {
            if (allowFallback) {
                return where || {};
            }
            throw e;
        }
    }
}

