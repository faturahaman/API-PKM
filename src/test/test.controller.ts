import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@ApiTags('Test')
@ApiBearerAuth('JWT-auth')
@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) { }

    @Get()
    @ApiOperation({ summary: 'Get all test resources' })
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Items per page' })
    @ApiQuery({ name: 'search', required: false, example: 'test', description: 'Search term' })
    @ApiResponse({
        status: 200,
        description: 'List of resources retrieved successfully',
        schema: {
            example: {
                success: true,
                message: 'Resources retrieved successfully',
                data: [
                    {
                        id: 'abc123456',
                        name: 'Sample Resource',
                        description: 'Sample description',
                        value: 100,
                        createdAt: '2026-03-24T20:58:21Z',
                    },
                ],
                meta: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                },
            },
        },
    })
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.testService.findAll(
            page ? +page : 1,
            limit ? +limit : 10,
            search,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single test resource by ID' })
    @ApiParam({ name: 'id', example: 'abc123456', description: 'The unique identifier of the resource' })
    @ApiResponse({
        status: 200,
        description: 'Resource found',
        schema: {
            example: {
                success: true,
                message: 'Resource found successfully',
                data: {
                    id: 'abc123456',
                    name: 'Sample Resource',
                    description: 'Sample description',
                    value: 100,
                    createdAt: '2026-03-24T20:58:21Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Resource not found',
        schema: {
            example: {
                success: false,
                message: 'Resource with ID abc123456 not found',
                data: null,
            },
        },
    })
    findOne(@Param('id') id: string) {
        return this.testService.findOne(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Create a new test resource' })
    @ApiBody({ type: CreateTestDto })
    @ApiResponse({
        status: 201,
        description: 'Resource created successfully',
        schema: {
            example: {
                success: true,
                message: 'Resource created successfully',
                data: {
                    id: 'def789012',
                    name: 'New Resource',
                    description: 'New description',
                    value: 200,
                    createdAt: '2026-03-24T20:58:21Z',
                },
            },
        },
    })
    create(@Body() createTestDto: CreateTestDto) {
        return this.testService.create(createTestDto);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update an existing test resource' })
    @ApiParam({ name: 'id', example: 'abc123456' })
    @ApiBody({ type: UpdateTestDto })
    @ApiResponse({
        status: 200,
        description: 'Resource updated successfully',
        schema: {
            example: {
                success: true,
                message: 'Resource updated successfully',
                data: {
                    id: 'abc123456',
                    name: 'Updated Resource',
                    description: 'Updated description',
                    value: 150,
                    updatedAt: '2026-03-24T20:58:21Z',
                },
            },
        },
    })
    update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
        return this.testService.update(id, updateTestDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete a test resource' })
    @ApiParam({ name: 'id', example: 'abc123456' })
    @ApiResponse({
        status: 200,
        description: 'Resource deleted successfully',
        schema: {
            example: {
                success: true,
                message: 'Resource deleted successfully',
                data: {
                    id: 'abc123456',
                    name: 'Deleted Resource',
                },
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.testService.remove(id);
    }
}
