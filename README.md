# PKM Server - Backend API 🛠️

Ini adalah repositori backend **PKM** yang dibangun menggunakan **NestJS**. Menyediakan layanan RESTful API yang aman, efisien, dan terstruktur.

## 🚀 Tech Stack

- **Framework:** [NestJS 11](https://nestjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MySQL](https://www.mysql.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Authentication:** [Passport.js](https://www.passportjs.org/) & [JWT](https://jwt.io/)
- **Mailing:** [Nodemailer](https://nodemailer.com/) via `@nestjs-modules/mailer`
- **Validation:** `class-validator` & `class-transformer`
- **Security:** Helmet, CORS, Throttler, Bcrypt

## 🛠️ Persiapan Awal (Setup)

### 1. Prasyarat (Prerequisites)
- [Node.js](https://nodejs.org/)
- [MySQL Server](https://www.mysql.com/downloads/)
- npm

### 2. Instalasi Dependensi
Masuk ke direktori `server` dan jalankan:
```bash
npm install
```

### 3. Konfigurasi Database
1. Buat database baru di MySQL (misal: `pkm_db`).
2. Masukkan data awal jika diperlukan menggunakan file SQL yang tersedia:
   - `dummy_data_lengkap_v4.sql` (Data lengkap)
   - atau `test_data_3_puskesmas.sql`

### 4. Konfigurasi Environment (Lingkungan)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Lalu konfigurasikan variabel penting berikut:

- **Database**: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`.
- **Security**: 
  - `JWT_SECRET`: String unik untuk keamanan token login.
  - `RECAPTCHA_SECRET_KEY`: Secret key dari Google ReCAPTCHA (untuk validasi sisi server).
- **CORS**: `CORS_ORIGINS` (contoh: `http://localhost:3000`).
- **Email (Fitur Konsultasi)**:
  - `GMAIL_USER`: Alamat email Gmail Anda.
  - `GMAIL_APP_PASSWORD`: **App Password** (bukan password akun biasa). Anda bisa membuatnya di pengaturan keamanan Google (2-Step Verification harus aktif).

> [!TIP]
> Fitur kirim email digunakan pada modul **Konsultasi** untuk memberikan notifikasi otomatis kepada pengguna atau admin.

### 5. Menjalankan Server
**Mode Pengembangan (Watch Mode):**
```bash
npm run start:dev
```

**Mode Produksi:**
```bash
npm run build
npm run start:prod
```

## 📜 Skrip yang Tersedia

- `npm run start:dev`: Menjalankan server dengan reload otomatis saat ada perubahan kode.
- `npm run build`: Mengompilasi kode TypeScript ke JavaScript di folder `dist`.
- `npm run test`: Menjalankan unit tests.
- `npm run lint`: Mengecek kualitas kode dengan ESLint.
- `npm run format`: Merapikan kode menggunakan Prettier.

## 📂 Struktur Utama Proyek

- `/src`: Berisi kode sumber utama aplikasi.
  - `/modules`: Modul-modul fitur (Auth, Users, Puskesmas, dll).
  - `/common`: Decorator, filter, guard, dan interceptor global.
  - `/config`: Konfigurasi aplikasi dan database.
- `/test`: End-to-end tests.

---

Dibuat dengan ❤️ untuk PKM.
