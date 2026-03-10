import { Controller, Get, HttpCode, Post, Body, Req, UseGuards } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import type { Request } from 'express';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) { }

  @UseGuards(ThrottlerGuard)
  @Throttle({ short: { ttl: 60000, limit: 30 }, medium: { ttl: 3600000, limit: 500 } })
  @Post()
  @HttpCode(201)
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorService.create(createVisitorDto);
  }

  @Post('log')
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
}