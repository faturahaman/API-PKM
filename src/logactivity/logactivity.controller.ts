import { Controller, Get, Param, Query, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LogactivityService } from './logactivity.service';
import type { ActivityLogQueryDto } from './logactivity.service';

@Controller('logactivity')
export class LogactivityController {
  constructor(private readonly logactivityService: LogactivityService) { }

  /**
   * Get all activity logs with filters and pagination
   * GET /api/logactivity
   */
  @Get()
  async findAll(@Query() query: ActivityLogQueryDto) {
    return this.logactivityService.findAllWithFilters(query);
  }

  /**
   * Get activity summary statistics
   * GET /api/logactivity/summary
   */
  @Get('summary')
  async getSummary() {
    return this.logactivityService.getSummary();
  }

  /**
   * Get activity logs by admin ID
   * GET /api/logactivity/admin/:adminId
   */
  @Get('admin/:adminId')
  async findByAdmin(
    @Param('adminId') adminId: string,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.logactivityService.findByAdmin(adminId, limitNum);
  }

  /**
   * Get activity logs by entity ID
   * GET /api/logactivity/entity/:entityId
   */
  @Get('entity/:entityId')
  async findByEntity(@Param('entityId') entityId: string) {
    return this.logactivityService.findByEntity(entityId);
  }

  /**
   * Delete old activity logs (retention policy)
   * POST /api/logactivity/cleanup
   * Body: { daysOld?: number } - default 90 days
   */
  @Post('cleanup')
  async cleanup(@Body('daysOld') daysOld?: string) {
    const days = daysOld ? parseInt(daysOld, 10) : 90;
    const deleted = await this.logactivityService.deleteOldLogs(days);
    return { message: `Deleted ${deleted} old activity logs`, deletedCount: deleted };
  }
}
