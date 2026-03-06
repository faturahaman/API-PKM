import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PuskesmasService } from './puskesmas.service';
import { CreatePuskesmasDto } from './dto/create-puskesmas.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('puskesmas')
export class PuskesmasController {
  constructor(private readonly puskesmasService: PuskesmasService) { }

  @Get()
  findAll() {
    return this.puskesmasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puskesmasService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.puskesmasService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPuskesmasDto: CreatePuskesmasDto) {
    return this.puskesmasService.create(createPuskesmasDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updatePuskesmasDto: Partial<CreatePuskesmasDto>) {
    return this.puskesmasService.update(id, updatePuskesmasDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.puskesmasService.remove(id);
  }
}
