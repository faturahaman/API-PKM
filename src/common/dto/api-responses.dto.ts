import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Standard error response structure
 * Used for all error responses across the API
 * 
 * @example
 * // Validation error (400)
 * {
 *   success: false,
 *   message: "Validation failed",
 *   errors: [
 *     { "field": "email", "message": "Email is required" },
 *     { "field": "password", "message": "Password must be at least 8 characters" }
 *   ]
 * }
 * 
 * @example
 * // Authentication error (401)
 * {
 *   success: false,
 *   message: "Unauthorized: Invalid or missing token",
 *   errors: []
 * }
 * 
 * @example
 * // Not found error (404)
 * {
 *   success: false,
 *   message: "Resource not found",
 *   errors: []
 * }
 * 
 * @example
 * // Server error (500)
 * {
 *   success: false,
 *   message: "Internal server error",
 *   errors: []
 * }
 */
export class ErrorResponseDto {
    @ApiProperty({
        example: false,
        description: 'Always `false` for error responses',
        type: Boolean
    })
    success: boolean;

    @ApiProperty({
        example: 'Something went wrong',
        description: 'Human-readable error message describing what went wrong',
        type: String
    })
    message: string;

    @ApiPropertyOptional({
        required: false,
        example: [],
        description: 'Array of field-specific errors. Empty for general errors. Contains objects with `field` and `message` properties.'
    })
    errors?: Array<{
        field?: string;
        message: string;
    }>;
}

/**
 * Pagination metadata structure
 * Included in paginated responses to provide pagination info
 * 
 * @example
 * {
 *   total: 100,
 *   page: 1,
 *   limit: 10,
 *   totalPages: 10
 * }
 */
export class PaginatedMetaDto {
    @ApiProperty({
        example: 100,
        description: 'Total number of items across all pages',
        type: Number
    })
    total: number;

    @ApiProperty({
        example: 1,
        description: 'Current page number (1-based)',
        type: Number
    })
    page: number;

    @ApiProperty({
        example: 10,
        description: 'Number of items per page',
        type: Number
    })
    limit: number;

    @ApiProperty({
        example: 10,
        description: 'Total number of available pages (ceiling of total/limit)',
        type: Number
    })
    totalPages: number;
}
