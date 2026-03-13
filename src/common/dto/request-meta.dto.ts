export interface RequestMetaDto {
    ip_address?: string;
    user_agent?: string;
    route?: string;
    method?: string;
}

/**
 * Extract request metadata from an Express/NestJS request object
 */
export function extractRequestMeta(req: any): RequestMetaDto {
    const forwardedFor = req?.headers?.['x-forwarded-for'];
    const ip = forwardedFor
        ? forwardedFor.split(',')[0].trim()
        : req?.headers?.['x-real-ip'] || req?.socket?.remoteAddress || undefined;

    return {
        ip_address: ip,
        user_agent: req?.headers?.['user-agent'] || undefined,
        route: req?.route?.path || req?.url || undefined,
        method: req?.method || undefined,
    };
}
