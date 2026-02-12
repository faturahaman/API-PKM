import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    // UseGuards // Biasanya admin butuh Guard/Auth
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
// Prefix route menjadi 'admin/services'
@UseGuards(AuthGuard('jwt'))
@Controller('admin/services') 
export class AdminServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateServiceDto: UpdateServiceDto,
    ) {
        return this.servicesService.update(id, updateServiceDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.remove(id);
    }
    
}