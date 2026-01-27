import {
  Controller,
  Get,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AdminsService } from './admins.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {

  constructor(private adminsService: AdminsService) { }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return req.user;
  }

  @Put('update-profile')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = join(process.cwd(), 'public', 'profiles');
        if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        const filename = `admin-${Date.now()}${ext}`;
        cb(null, filename);
      },
    }),

    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async updateProfile(
    @Request() req: any,
    @Body() body: { name: string },
    @UploadedFile() file?: Express.Multer.File
  ) {
    const adminId = req.user._id;

    const photoPath = file ? file.filename : undefined;

    return this.adminsService.updateProfile(adminId, photoPath, body.name);
  }
}