/**
 * Payload Sanitization Helper
 * 
 * Removes sensitive data before logging to activity log.
 * Maximum payload size is limited to ~2KB.
 */

import { Logger } from '@nestjs/common';

const logger = new Logger('PayloadSanitizer');

// Fields that should never be logged
const SENSITIVE_FIELDS = [
    'password',
    'token',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'current_token',
    'image_base64',
    'base64Image',
    'file',
    'files',
    'secret',
    'apiKey',
    'api_key',
    'privateKey',
    'private_key',
    'creditCard',
    'credit_card',
    'cvv',
    'pin',
];

// Maximum payload size in bytes (~2KB)
const MAX_PAYLOAD_SIZE = 2048;

/**
 * Recursively sanitize an object, removing sensitive fields
 */
export function sanitizePayload(data: any): Record<string, any> | null {
    if (!data || typeof data !== 'object') {
        return null;
    }

    try {
        // Handle arrays
        if (Array.isArray(data)) {
            return data.map(item => sanitizePayload(item));
        }

        // Handle plain objects
        const sanitized: Record<string, any> = {};
        let currentSize = 0;

        for (const [key, value] of Object.entries(data)) {
            // Skip sensitive fields (case insensitive)
            const lowerKey = key.toLowerCase();
            if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field.toLowerCase()))) {
                sanitized[key] = '[REDACTED]';
                continue;
            }

            // Skip large binary data
            if (value instanceof Buffer || value instanceof ArrayBuffer) {
                sanitized[key] = '[BINARY_DATA]';
                continue;
            }

            // Recursively sanitize nested objects
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                sanitized[key] = sanitizePayload(value);
            } else if (Array.isArray(value)) {
                sanitized[key] = value.map(item =>
                    typeof item === 'object' ? sanitizePayload(item) : item
                );
            } else {
                sanitized[key] = value;
            }

            // Calculate approximate size and truncate if needed
            const valueStr = JSON.stringify(sanitized[key]);
            currentSize += valueStr.length;

            if (currentSize > MAX_PAYLOAD_SIZE) {
                logger.warn(`Payload size exceeded ${MAX_PAYLOAD_SIZE} bytes, truncating`);
                sanitized[key] = '[TRUNCATED]';
                break;
            }
        }

        return sanitized;
    } catch (error) {
        logger.error(`Error sanitizing payload: ${error.message}`);
        return { error: 'Failed to sanitize payload' };
    }
}

/**
 * Extract only specific fields from an object for logging
 */
export function extractFields<T extends Record<string, any>>(
    data: T,
    fields: (keyof T)[]
): Partial<T> {
    if (!data || typeof data !== 'object') {
        return {};
    }

    const extracted: Partial<T> = {};
    for (const field of fields) {
        if (field in data) {
            extracted[field] = data[field];
        }
    }

    return sanitizePayload(extracted) as Partial<T>;
}

/**
 * Create a summary of changes between before and after states
 */
export function createChangeSummary(
    before: Record<string, any> | null,
    after: Record<string, any> | null
): { added: string[]; removed: string[]; modified: string[] } {
    const summary = {
        added: [] as string[],
        removed: [] as string[],
        modified: [] as string[],
    };

    if (!before) before = {};
    if (!after) after = {};

    const beforeKeys = Object.keys(before);
    const afterKeys = Object.keys(after);

    // Find added fields
    for (const key of afterKeys) {
        if (!beforeKeys.includes(key)) {
            summary.added.push(key);
        }
    }

    // Find removed fields
    for (const key of beforeKeys) {
        if (!afterKeys.includes(key)) {
            summary.removed.push(key);
        }
    }

    // Find modified fields
    for (const key of afterKeys) {
        if (beforeKeys.includes(key) && JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
            summary.modified.push(key);
        }
    }

    return summary;
}
