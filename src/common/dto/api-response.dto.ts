import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Generic API response wrapper for single resource responses
 * Use this for standard single-item responses (GET by ID, POST, PUT, PATCH)
 * 
 * @example
 * {
 *   success: true,
 *   message: "Data retrieved successfully",
 *   data: { id: "uuid", name: "Example" },
 *   meta: null
 * }
 */
export class ApiResponseDto<T> {
    @ApiProperty({
        example: true,
        description: 'Indicates whether the request was successful. Always `true` for successful responses.',
        type: Boolean
    })
    success: boolean;

    @ApiProperty({
        example: 'Operation successful',
        description: 'Human-readable message describing the response status',
        type: String
    })
    message: string;

    @ApiProperty({
        description: 'The actual response data. Type depends on the endpoint. Can be null for operations that do not return data.',
        nullable: true
    })
    data: T;

    @ApiPropertyOptional({
        description: 'Additional metadata for the response. Typically null for single-item responses. Use for nested pagination or custom metadata.',
        nullable: true,
        example: null
    })
    meta?: any;
}

/**
 * Paginated API response wrapper for list endpoints
 * Use this for endpoints that return paginated lists (GET with pagination)
 * 
 * @example
 * {
 *   success: true,
 *   message: "Data retrieved successfully",
 *   data: [
 *     { id: "uuid-1", name: "Item 1" },
 *     { id: "uuid-2", name: "Item 2" }
 *   ],
 *   meta: {
 *     total: 100,
 *     page: 1,
 *     limit: 10,
 *     totalPages: 10
 *   }
 * }
 */
export class PaginatedResponseDto<T> {
    @ApiProperty({
        example: true,
        description: 'Indicates whether the request was successful. Always `true` for successful responses.',
        type: Boolean
    })
    success: boolean;

    @ApiProperty({
        example: 'Operation successful',
        description: 'Human-readable message describing the response status',
        type: String
    })
    message: string;

    @ApiProperty({
        description: 'Array of items for the current page',
        isArray: true
    })
    data: T[];

    @ApiProperty({
        description: 'Pagination metadata containing total counts and page information',
        example: {
            total: 100,
            page: 1,
            limit: 10,
            totalPages: 10
        }
    })
    meta: {
        /** Total number of items across all pages */
        total: number;
        /** Current page number (1-based) */
        page: number;
        /** Number of items per page */
        limit: number;
        /** Total number of available pages */
        totalPages: number;
    };
}
