import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: any;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                // If the data already has a success wrapper, return as is
                if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
                    return data;
                }

                // Standard success/message/data wrapper
                const isWrapped = data?.data !== undefined;
                const hasPagination = data?.total !== undefined ||
                    data?.docs !== undefined ||
                    data?.totalPages !== undefined ||
                    data?.meta !== undefined;

                return {
                    success: context.switchToHttp().getResponse().statusCode < 400,
                    message: data?.message || 'Operation successful',
                    // Only auto-unwrap if it's a simple { data, message } or { data } object 
                    // AND NOT a paginated response (which might have total, docs, meta, etc.)
                    data: (isWrapped && !hasPagination) ? data.data : data,
                    meta: data?.meta,
                };
            }),
        );
    }
}
