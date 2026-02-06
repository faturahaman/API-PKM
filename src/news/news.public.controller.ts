import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news') // Endpoint: /api/v1/news
export class NewsPublicController {
  constructor(private readonly newsService: NewsService) { }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    // Method ini sama dengan admin, tapi tujuannya untuk public view
    return this.newsService.findAll(p, l, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }
}