import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { KritikSaranService } from './kritik-saran.service';
import { CreateKritikSaranDto, UpdateKritikSaranDto, KritikSaranQueryDto } from './dto/create-kritik-saran.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class KritikSaranController {
    constructor(private readonly kritikSaranService: KritikSaranService) { }

    @Post('kritik-saran')
    async create(@Body() createDto: CreateKritikSaranDto) {
        return this.kritikSaranService.create(createDto);
    }

    @Get('kritik-saran')
    async findAll(@Query() query: KritikSaranQueryDto) {
        return this.kritikSaranService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('admin/kritik-saran')
    async findAllAdmin(@Query() query: KritikSaranQueryDto) {
        return this.kritikSaranService.findAll(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('admin/kritik-saran/stats')
    async getStats() {
        return this.kritikSaranService.getStats();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('admin/kritik-saran/:id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.kritikSaranService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('admin/kritik-saran/:id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateKritikSaranDto,
    ) {
        return this.kritikSaranService.update(id, updateDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('admin/kritik-saran/:id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.kritikSaranService.remove(id);
        return { success: result };
    }
}
