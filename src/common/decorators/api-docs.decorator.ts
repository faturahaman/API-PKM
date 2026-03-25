import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiResponse,
    getSchemaPath,
    ApiParam,
    ApiQuery,
    ApiOperation,
} from '@nestjs/swagger';
import { ApiResponseDto, PaginatedResponseDto } from '../dto/api-response.dto';
import { ErrorResponseDto } from '../dto/api-responses.dto';

interface ApiResponseOptions {
    type?: Type<any> | string;
    description?: string;
    isArray?: boolean;
}

/**
 * Standard API response decorator for single resource responses
 * Automatically wraps response in ApiResponseDto<T> structure
 */
export function ApiStandardResponse(options: ApiResponseOptions & { status?: number }) {
    const isCreated = options.status === 201;
    const Decorator = isCreated ? ApiCreatedResponse : ApiOkResponse;

    const models = options.type && typeof options.type !== 'string' ? [options.type as Type<any>] : [];

    return applyDecorators(
        ApiExtraModels(ApiResponseDto, ...models),
        Decorator({
            description: options.description || 'Successful response',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiResponseDto) },
                    {
                        properties: {
                            data: options.type
                                ? options.isArray
                                    ? { type: 'array', items: { $ref: getSchemaPath(options.type as Type<any>) } }
                                    : { $ref: getSchemaPath(options.type as Type<any>) }
                                : { type: 'object', nullable: true },
                        },
                    },
                ],
            },
        }),
    );
}

/**
 * Paginated response decorator for list endpoints
 * Automatically includes pagination metadata in response
 */
export function ApiPaginatedResponse(options: ApiResponseOptions) {
    const models = options.type && typeof options.type !== 'string' ? [options.type as Type<any>] : [];

    return applyDecorators(
        ApiExtraModels(PaginatedResponseDto, ...models),
        ApiOkResponse({
            description: options.description || 'List retrieved successfully',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginatedResponseDto) },
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: options.type && typeof options.type !== 'string'
                                    ? { $ref: getSchemaPath(options.type as Type<any>) }
                                    : { type: 'object' },
                            },
                        },
                    },
                ],
            },
        }),
    );
}

/**
 * Standard error responses decorator
 * Includes all common HTTP error status codes with detailed descriptions
 */
export function ApiErrorResponses() {
    return applyDecorators(
        ApiExtraModels(ErrorResponseDto),
        ApiResponse({
            status: 400,
            description: 'Bad Request - Validation failed or invalid input parameters',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ErrorResponseDto) },
                    {
                        example: {
                            success: false,
                            message: 'Validation failed',
                            errors: [
                                { field: 'name', message: 'Name is required' }
                            ]
                        }
                    }
                ]
            }
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized - Invalid or missing authentication token',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ErrorResponseDto) },
                    {
                        example: {
                            success: false,
                            message: 'Unauthorized: Invalid or missing token',
                            errors: []
                        }
                    }
                ]
            }
        }),
        ApiResponse({
            status: 403,
            description: 'Forbidden - Insufficient permissions to access this resource',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ErrorResponseDto) },
                    {
                        example: {
                            success: false,
                            message: 'Forbidden: You do not have permission to access this resource',
                            errors: []
                        }
                    }
                ]
            }
        }),
        ApiResponse({
            status: 404,
            description: 'Not Found - The requested resource does not exist',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ErrorResponseDto) },
                    {
                        example: {
                            success: false,
                            message: 'Resource not found',
                            errors: []
                        }
                    }
                ]
            }
        }),
        ApiResponse({
            status: 409,
            description: 'Conflict - Resource already exists or conflict with current state',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ErrorResponseDto) },
                    {
                        example: {
                            success: false,
                            message: 'Conflict: Resource already exists',
                            errors: []
                        }
                    }
                ]
            }
        }),
        ApiResponse({
            status: 422,
            description: 'Unprocessable Entity - Business logic validation failed',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ErrorResponseDto) },
                    {
                        example: {
                            success: false,
                            message: 'Unprocessable entity',
                            errors: [
                                { field: 'email', message: 'Email already in use' }
                            ]
                        }
                    }
                ]
            }
        }),
        ApiResponse({
            status: 500,
            description: 'Internal Server Error - Unexpected server error',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ErrorResponseDto) },
                    {
                        example: {
                            success: false,
                            message: 'Internal server error',
                            errors: []
                        }
                    }
                ]
            }
        }),
    );
}

/**
 * Common query parameters for pagination and search
 * Use this decorator to automatically add page, limit, and search query parameters
 */
export function ApiCommonParams() {
    return applyDecorators(
        ApiQuery({
            name: 'page',
            required: false,
            example: 1,
            description: 'Page number for pagination (starts from 1)',
            schema: { type: 'integer', minimum: 1, default: 1 }
        }),
        ApiQuery({
            name: 'limit',
            required: false,
            example: 10,
            description: 'Number of items per page (maximum 100)',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }),
        ApiQuery({
            name: 'search',
            required: false,
            example: 'search term',
            description: 'Search term for filtering results (case-insensitive)',
            schema: { type: 'string', maxLength: 255 }
        }),
    );
}

/**
 * Pagination query parameters only
 * Use when you don't need search functionality
 */
export function ApiPaginationParams() {
    return applyDecorators(
        ApiQuery({
            name: 'page',
            required: false,
            example: 1,
            description: 'Page number for pagination (starts from 1)',
            schema: { type: 'integer', minimum: 1, default: 1 }
        }),
        ApiQuery({
            name: 'limit',
            required: false,
            example: 10,
            description: 'Number of items per page (maximum 100)',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }),
    );
}

/**
 * Success response decorator with custom message
 * Provides consistent success response format
 */
export function ApiSuccessResponse(description?: string, message?: string) {
    return applyDecorators(
        ApiExtraModels(ApiResponseDto),
        ApiOkResponse({
            description: description || 'Operation successful',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiResponseDto) },
                    {
                        example: {
                            success: true,
                            message: message || 'Operation successful',
                            data: {},
                            meta: null
                        }
                    }
                ]
            }
        }),
    );
}

/**
 * Created response decorator for POST endpoints
 * Provides consistent creation response format
 */
export function ApiCreatedResponseDoc(description?: string, message?: string) {
    return applyDecorators(
        ApiExtraModels(ApiResponseDto),
        ApiCreatedResponse({
            description: description || 'Resource created successfully',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiResponseDto) },
                    {
                        example: {
                            success: true,
                            message: message || 'Resource created successfully',
                            data: {},
                            meta: null
                        }
                    }
                ]
            }
        }),
    );
}

/**
 * Detailed operation description builder
 * Creates comprehensive ApiOperation with use cases and behavior notes
 */
export function ApiOperationDetailed(options: {
    summary: string;
    description?: string;
    useCases?: string[];
    behavior?: string[];
    notes?: string[];
}) {
    let fullDescription = options.description || '';

    if (options.useCases && options.useCases.length > 0) {
        fullDescription += '\n\n**Use Cases:**\n' + options.useCases.map(uc => `- ${uc}`).join('\n');
    }

    if (options.behavior && options.behavior.length > 0) {
        fullDescription += '\n\n**Behavior:**\n' + options.behavior.map(b => `- ${b}`).join('\n');
    }

    if (options.notes && options.notes.length > 0) {
        fullDescription += '\n\n**Notes:**\n' + options.notes.map(n => `- ${n}`).join('\n');
    }

    return ApiOperation({
        summary: options.summary,
        description: fullDescription,
    });
}

/**
 * UUID parameter decorator with proper examples
 */
export function ApiUuidParam(name: string, description?: string) {
    return ApiParam({
        name,
        description: description || `Unique identifier (UUID format)`,
        example: '550e8400-e29b-41d4-a716-446655440000',
        schema: { type: 'string', format: 'uuid' }
    });
}

/**
 * Slug parameter decorator for tenant identification
 */
export function ApiSlugParam(name: string, description?: string) {
    return ApiParam({
        name,
        description: description || `URL-friendly identifier (slug)`,
        example: 'pkm-bogor-tengah',
        schema: { type: 'string', pattern: '^[a-z0-9-]+$' }
    });
}
