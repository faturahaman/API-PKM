import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseArrayPipe, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { PuskesmasService } from './puskesmas.service';
import { CreatePuskesmasDto } from './dto/create-puskesmas.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '../admins/entity/admin.entity';

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

  // Public endpoint to check tenant status - used by frontend for redirect logic
  @Get('status/:slug')
  getStatus(@Param('slug') slug: string) {
    return this.puskesmasService.getStatus(slug);
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

  // === Status Management Endpoints (Super Admin Only) ===

  @Patch(':id/activate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  activate(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user.sub;
    return this.puskesmasService.activate(id, adminId);
  }

  @Patch(':id/deactivate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  deactivate(@Param('id') id: string, @Body('reason') reason: string, @Req() req: any) {
    const adminId = req.user.sub;
    return this.puskesmasService.deactivate(id, adminId, reason);
  }

  @Patch(':id/suspend')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  suspend(@Param('id') id: string, @Body('reason') reason: string, @Req() req: any) {
    const adminId = req.user.sub;
    return this.puskesmasService.suspend(id, adminId, reason);
  }

  @Patch(':id/maintenance')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  setMaintenance(
    @Param('id') id: string,
    @Body('message') message: string,
    @Req() req: any
  ) {
    const adminId = req.user.sub;
    return this.puskesmasService.setMaintenance(id, adminId, message);
  }

  @Patch(':id/maintenance/remove')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  removeMaintenance(@Param('id') id: string) {
    return this.puskesmasService.removeMaintenance(id);
  }
}
