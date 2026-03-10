import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseArrayPipe, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
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
  update(@Param('id') id: string, @Body() updatePuskesmasDto: any) {
    // Handle empty or undefined body
    if (!updatePuskesmasDto) {
      return this.puskesmasService.findOne(id);
    }

    // Convert body to clean object - remove undefined/null values and only keep valid fields
    const cleanData: Partial<CreatePuskesmasDto> = {};
    if (updatePuskesmasDto.name !== undefined && updatePuskesmasDto.name !== '') {
      cleanData.name = updatePuskesmasDto.name;
    }
    if (updatePuskesmasDto.slug !== undefined && updatePuskesmasDto.slug !== '') {
      cleanData.slug = updatePuskesmasDto.slug;
    }
    if (updatePuskesmasDto.status !== undefined && updatePuskesmasDto.status !== '') {
      cleanData.status = updatePuskesmasDto.status;
    }

    return this.puskesmasService.update(id, cleanData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.puskesmasService.remove(id);
  }
}
