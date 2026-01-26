import { 
  Controller, 
  Get, 
  Put, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path'; // Tambah 'join'
import { existsSync, mkdirSync } from 'fs'; // Tambah 'fs'
import { AdminsService } from './admins.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {
  
  constructor(private adminsService: AdminsService) {}

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
        
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `admin-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Hanya file gambar yang diperbolehkan!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 } 
  }))
  async updateProfile(
    @Request() req: any, 
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('File foto wajib diupload');
    }

    const adminId = req.user._id; 

    const photoPath = `profiles/${file.filename}`; 

    return this.adminsService.updatePhoto(adminId, photoPath);
  }
}