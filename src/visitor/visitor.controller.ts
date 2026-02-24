import { Controller, Get, HttpCode, Post, Body, Req } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import type { Request } from 'express';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) { }

  @Post()
  @HttpCode(201)
  create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorService.create(createVisitorDto);
  }

  @Post('track')
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