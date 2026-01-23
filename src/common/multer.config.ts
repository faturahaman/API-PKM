import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const multerOptions = {
  limits: { fileSize: 3 * 1024 * 1024 },   // Max 3MB
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = './public/uploads/gallery';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // rename file jadi unik
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, file must be : jpg, jpeg, png'), false);
    }
  },
};