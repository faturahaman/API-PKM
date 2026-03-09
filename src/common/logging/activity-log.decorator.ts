import { SetMetadata } from '@nestjs/common';
import { LogActivityAction } from '../../logactivity/entity/log-activity.entity';

/**
 * Activity Log Metadata Keys
 */
export const ACTIVITY_LOG_KEY = 'activity_log';

/**
 * Interface for Activity Log Decorator Options
 */
export interface ActivityLogOptions {
    /**
     * The module name (e.g., 'BANNER', 'AGENDA', 'MENU')
     */
    module: string;

    /**
     * The action performed (CREATE, UPDATE, DELETE)
     */
    action: LogActivityAction;

    /**
     * Optional: Function to extract entity ID from the result
     * @param result - The return value of the decorated method
     * @returns The entity ID string
     */
    getEntityId?: (result: any) => string | undefined;

    /**
     * Optional: Function to extract the full payload from arguments
     * @param args - The arguments passed to the decorated method
     * @returns The payload object to log
     */
    getPayload?: (args: any[]) => Record<string, any>;

    /**
     * Optional: Description of the activity
     */
    description?: string;

    /**
     * Optional: Whether to capture the "before" state for updates/deletes
     * Pass a function that returns the original entity
     */
    getBeforeState?: (args: any[]) => Promise<Record<string, any>> | Record<string, any>;
}

/**
 * Activity Log Decorator
 * 
 * Usage:
 * ```typescript
 * @ActivityLog({
 *   module: 'BANNER',
 *   action: LogActivityAction.CREATE,
 *   getEntityId: (result) => result?.id,
 *   description: 'Create new banner'
 * })
 * async createBanner(dto: CreateBannerDto) { ... }
 * ```
 */
export function ActivityLog(options: ActivityLogOptions) {
    return SetMetadata(ACTIVITY_LOG_KEY, options);
}

/**
 * Helper to get activity log options from metadata
 */
export function getActivityLogOptions(target: any, propertyKey: string): ActivityLogOptions | undefined {
    return Reflect.getMetadata(ACTIVITY_LOG_KEY, target, propertyKey);
}
