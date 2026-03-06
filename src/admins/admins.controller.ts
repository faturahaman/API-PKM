import {
  Controller, Get, Patch, UseGuards, Request, UseInterceptors,
  UploadedFile, Body
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminsService } from './admins.service';
import { createMulterOptions } from '../common/multer.utils';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {

  constructor(private adminsService: AdminsService) { }

  @Get('profile')
  getProfile(@Request() req: any) {
    const { password, ...user } = req.user;
    return user;
  }

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    const { password, ...user } = req.user;
    return user;
  }

  @Patch('profile')
  @UseInterceptors(FileInterceptor('photo', createMulterOptions('profile')))
  async updateProfile(
    @Request() req: any,
    @Body() body: { name: string },
    @UploadedFile() file?: Express.Multer.File
  ) {
    const adminId = req.user.id;
    const photoPath = file ? file.filename : undefined;
    return this.adminsService.updateProfile(adminId, photoPath, body.name);
  }
}