import { diskStorage } from 'multer';
import { extname, join } from 'path'; // Tambahkan 'join'
import { existsSync, mkdirSync } from 'fs';

export const multerOptions = {
  limits: { fileSize: 3 * 1024 * 1024 }, // Max 3MB
  storage: diskStorage({
    destination: (req, file, cb) => {
      // --- PERBAIKAN DI SINI ---
      // Jangan pakai './public', tapi pakai process.cwd() biar path absolut
      const uploadPath = join(process.cwd(), 'public','profiles', 'gallery');

      // Buat folder otomatis jika belum ada
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Generate nama unik
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