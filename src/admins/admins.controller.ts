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
import { extname } from 'path';
import { AdminsService } from './admins.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {
  
  // Inject Service
  constructor(private adminsService: AdminsService) {}

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return req.user;
  }

  // === FITUR UPDATE PHOTO ===
  @Put('update-profile')
  @UseInterceptors(FileInterceptor('photo', {
    // Konfigurasi penyimpanan file
    storage: diskStorage({
      destination: './uploads/profiles', 
      filename: (req, file, cb) => {
        //  Generate nama unik
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `admin-${uniqueSuffix}${ext}`);
      },
    }),
    //validasi tipe
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

    // Ambil ID dari req.user (hasil JWT Strategy)
    const adminId = req.user._id; 

    // bikin path file
    const photoPath = `uploads/profiles/${file.filename}`; 

    return this.adminsService.updatePhoto(adminId, photoPath);
  }
}