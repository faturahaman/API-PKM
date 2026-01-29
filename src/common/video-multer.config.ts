import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

export const videoMulterOptions = {
  // Limit 200MB (dalam bytes)
  limits: { fileSize: 62 * 1024 * 1024 }, 
  
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Path: public/uploads/video
      const uploadPath = join(process.cwd(), 'public', 'uploads', 'video');

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Penamaan unik biar gak bentrok
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `VID-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    // Validasi format video
    if (file.mimetype.match(/\/(mp4|webm|ogg|quicktime|x-msvideo)$/)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Format file tidak didukung! Hanya mp4, webm, ogg, mov, avi'), false);
    }
  },
};