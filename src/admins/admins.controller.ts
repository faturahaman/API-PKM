import {
  Controller, Get, Patch, UseGuards, Request, UseInterceptors,
  UploadedFile, Body, Param, Delete, Query, Post
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminsService } from './admins.service';
import { createMulterOptions } from '../common/multer.utils';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
    email: string;
    name?: string;
    password?: string;
  };
}

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {

  constructor(private adminsService: AdminsService) { }

  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    const { password, ...user } = req.user;
    return user;
  }

  @Get('dashboard')
  getDashboard(@Request() req: AuthenticatedRequest) {
    const { password, ...user } = req.user;
    return user;
  }

  // Admin Data Management
  @Get('admins')
  getAllAdmins(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.adminsService.findAll(
      search,
      role,
      limit ? parseInt(limit) : 10,
      offset ? parseInt(offset) : 0
    );
  }

  @Post('admins')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminsService.create(dto.name, dto.password, dto.role as string, dto.puskesmas_id);
  }

  @Get('admins/:id')
  getAdminById(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @Patch('admins/:id')
  updateAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateAdminDto
  ) {
    return this.adminsService.update(id, dto);
  }

  @Delete('admins/:id')
  deleteAdmin(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const currentAdminId = req.user.id;
    return this.adminsService.delete(id, currentAdminId);
  }

  @Patch('profile')
  @UseInterceptors(FileInterceptor('photo', createMulterOptions('profile')))
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() body: { name: string },
    @UploadedFile() file?: Express.Multer.File
  ) {
    const adminId = req.user.id;
    const photoPath = file ? file.filename : undefined;
    return this.adminsService.updateProfile(adminId, photoPath, body.name);
  }
}
