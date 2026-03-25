import { Controller, Get, HttpCode, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiErrorResponses,
  ApiCreatedResponseDoc,
  ApiOperationDetailed
} from '../common/decorators/api-docs.decorator';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import type { Request } from 'express';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@ApiTags('Visitor Tracking')
@Controller('v-stats')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) { }

  @UseGuards(ThrottlerGuard)
  @Throttle({ short: { ttl: 60000, limit: 30 }, medium: { ttl: 3600000, limit: 500 } })
  @Post()
  @HttpCode(201)
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorService.create(createVisitorDto);
  }

  @Post('v-session')
  @UseGuards(ThrottlerGuard)
  @Throttle({ short: { ttl: 60000, limit: 30 }, medium: { ttl: 3600000, limit: 500 } })
  @HttpCode(200)
  autoTrack(@Req() req: Request) {
    return this.visitorService.trackVisitor(req);
  }

  @Get()
  findAll() {
    return this.visitorService.findAll();
  }

  @Get('count')
  count() {
    return this.visitorService.countAll();
  }

  @Get('count-day')
  countByDay() {
    return this.visitorService.countByDay();
  }

  @Get('count-month')
  countByMonth() {
    return this.visitorService.countByMonth();
  }

  @Get('count-year')
  countByYear() {
    return this.visitorService.countByYear();
  }

  @Get('chart')
  getChartData(@Query('days') days?: string) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.visitorService.getChartData(parsedDays);
  }
}