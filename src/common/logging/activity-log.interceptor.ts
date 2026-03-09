import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { LogactivityService, CreateLogActivityDto } from '../../logactivity/logactivity.service';
import { LogActivityAction } from '../../logactivity/entity/log-activity.entity';
import { TenantContextService } from '../tenant/tenant-context.service';
import {
    ACTIVITY_LOG_KEY,
    ActivityLogOptions,
} from './activity-log.decorator';
import { sanitizePayload } from './payload-sanitizer';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ActivityLogInterceptor.name);

    constructor(
        private readonly reflector: Reflector,
        private readonly logactivityService: LogactivityService,
        private readonly tenantContextService: TenantContextService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Get activity log options from decorator
        const activityLogOptions = this.reflector.get<ActivityLogOptions>(
            ACTIVITY_LOG_KEY,
            context.getHandler(),
        );

        // If no decorator, skip logging
        if (!activityLogOptions) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest<any>();
        const response = context.switchToHttp().getResponse<any>();

        // Extract request metadata
        const ipAddress = this.getIpAddress(request);
        const userAgent = request.headers['user-agent'] || 'Unknown';
        const route = request.route?.path || request.url || 'Unknown';
        const method = request.method || 'UNKNOWN';

        // Get user and tenant context
        const user = request.user;
        const tenantId = this.tenantContextService.getTenantId();
        const userId = user?.sub || 'unknown';
        const userName = user?.name || 'unknown';
        const isSuperAdmin = this.tenantContextService.isSuperAdmin();

        // For non-super admin users, use their puskesmas_id
        const puskesmasId = isSuperAdmin ? tenantId : user?.puskesmas_id;

        // Store the start time for calculating response time
        const startTime = Date.now();

        // Get payload from request body (sanitized)
        const payload = sanitizePayload(request.body) || {};

        // Handle the request and log after completion
        return next.handle().pipe(
            tap({
                next: async (result) => {
                    // Use setImmediate for async (non-blocking) logging
                    setImmediate(async () => {
                        try {
                            try {
                                // Get entity ID from result using the provided function
                                const entityId = activityLogOptions.getEntityId
                                    ? activityLogOptions.getEntityId(result)
                                    : result?.id || undefined;

                                // Build the log data - only log essential fields
                                const logData: CreateLogActivityDto = {
                                    action: activityLogOptions.action,
                                    module: activityLogOptions.module,
                                    entity_id: entityId,
                                    payload_after: sanitizePayload(result) || undefined,
                                    ip_address: ipAddress,
                                    user_agent: userAgent,
                                    route,
                                    method,
                                    status_code: response.statusCode,
                                    admin_id: userId !== 'unknown' ? userId : undefined,
                                    admin_name: userName !== 'unknown' ? userName : undefined,
                                    puskesmas_id: puskesmasId,
                                };

                                // For UPDATE actions, we might want to get the before state
                                if (
                                    activityLogOptions.action === LogActivityAction.UPDATE &&
                                    activityLogOptions.getBeforeState
                                ) {
                                    try {
                                        const beforeState = await activityLogOptions.getBeforeState(
                                            request.body,
                                        );
                                        logData.payload_before = sanitizePayload(beforeState) || undefined;
                                    } catch (error) {
                                        this.logger.warn(
                                            `Failed to get before state: ${error.message}`,
                                        );
                                    }
                                }

                                // For CREATE actions, use the request payload as "after"
                                if (
                                    activityLogOptions.action === LogActivityAction.CREATE &&
                                    Object.keys(payload).length > 0
                                ) {
                                    logData.payload_after = {
                                        ...payload,
                                        ...(logData.payload_after || {}),
                                    };
                                }

                                // Save the log asynchronously
                                await this.logactivityService.log(logData);
                                this.logger.debug(
                                    `Activity logged: ${activityLogOptions.module}.${activityLogOptions.action} by ${userName}`,
                                );
                            } catch (innerError) {
                                // Inner error: logging logic error
                                this.logger.error(
                                    `Activity log failed (logic error): ${innerError.message}`,
                                    innerError.stack,
                                );
                            }
                        } catch (outerError) {
                            // Outer error: unhandled error in setImmediate
                            console.error('Activity log failed (unhandled):', outerError);
                        }
                    });
                },
                error: (error) => {
                    // Log errors that occur during the request
                    this.logger.debug(
                        `Activity ${activityLogOptions.action} failed: ${error.message}`,
                    );
                },
            }),
        );
    }

    /**
     * Extract IP address from request
     */
    private getIpAddress(request: any): string {
        // Check various headers for forwarded IPs
        const forwardedFor = request.headers['x-forwarded-for'];
        if (forwardedFor) {
            return forwardedFor.split(',')[0].trim();
        }

        // Check for real IP behind proxy
        const realIp = request.headers['x-real-ip'];
        if (realIp) {
            return realIp;
        }

        // Fall back to socket remote address
        return request.socket?.remoteAddress || 'unknown';
    }
}
