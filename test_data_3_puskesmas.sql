-- ============================================================
-- TEST DATA: 3 PUSKESMAS FOR MULTI-TENANT TESTING
-- ============================================================
-- Password for all users: admin123
-- bcrypt hash: $2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K
-- ============================================================

-- ============================================================
-- PUSKESMAS
-- ============================================================

-- Puskesmas 1: Bogor Tengah
INSERT INTO puskesmas (id, name, slug, alamat, primary_color, status, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Puskesmas Bogor Tengah', 'pkm-bogor-tengah', 'Jl. Raya Bogor No. 100', '#3b82f6', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Puskesmas 2: Bogor Utara  
INSERT INTO puskesmas (id, name, slug, alamat, primary_color, status, created_at, updated_at)
VALUES 
    ('22222222-2222-2222-2222-222222222222', 'Puskesmas Bogor Utara', 'pkm-bogor-utara', 'Jl. Pajajahan No. 45', '#ef4444', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Puskesmas 3: Bogor Selatan
INSERT INTO puskesmas (id, name, slug, alamat, primary_color, status, created_at, updated_at)
VALUES 
    ('33333333-3333-3333-3333-333333333333', 'Puskesmas Bogor Selatan', 'pkm-bogor-selatan', 'Jl. Cilember No. 78', '#10b981', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- ============================================================
-- ADMIN USERS
-- ============================================================

-- Super Admin (can access all puskesmas)
INSERT INTO admins (id, name, role, password, puskesmas_id, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000001', 'superadmin', 'SUPER_ADMIN', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Operator Bogor Tengah
INSERT INTO admins (id, name, role, password, puskesmas_id, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000002', 'operator_tengah', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', '11111111-1111-1111-1111-111111111111', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Operator Bogor Utara
INSERT INTO admins (id, name, role, password, puskesmas_id, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000003', 'operator_utara', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', '22222222-2222-2222-2222-222222222222', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Operator Bogor Selatan
INSERT INTO admins (id, name, role, password, puskesmas_id, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000004', 'operator_selatan', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', '33333333-3333-3333-3333-333333333333', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- ============================================================
-- MENUS - Bogor Tengah (type: 'static' or 'dynamic')
-- ============================================================
INSERT INTO menus (id, puskesmas_id, title, slug, type, status, `order`, parent_id, createdAt, updatedAt)
VALUES 
    ('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Beranda', 'beranda', 'static', 1, 1, NULL, NOW(), NOW()),
    ('10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Profil', 'profil', 'static', 1, 2, NULL, NOW(), NOW()),
    ('10000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Pelayanan', 'pelayanan', 'static', 1, 3, NULL, NOW(), NOW()),
    ('10000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Berita', 'berita', 'dynamic', 1, 4, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- ============================================================
-- MENUS - Bogor Utara (type: 'static' or 'dynamic')
-- ============================================================
INSERT INTO menus (id, puskesmas_id, title, slug, type, status, `order`, parent_id, createdAt, updatedAt)
VALUES 
    ('20000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Beranda', 'beranda', 'static', 1, 1, NULL, NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Profil', 'profil', 'static', 1, 2, NULL, NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Layanan', 'layanan', 'static', 1, 3, NULL, NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'Agenda', 'agenda', 'dynamic', 1, 4, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- ============================================================
-- MENUS - Bogor Selatan (type: 'static' or 'dynamic')
-- ============================================================
INSERT INTO menus (id, puskesmas_id, title, slug, type, status, `order`, parent_id, createdAt, updatedAt)
VALUES 
    ('30000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Beranda', 'beranda', 'static', 1, 1, NULL, NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Tentang Kami', 'tentang-kami', 'static', 1, 2, NULL, NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'Fasilitas', 'fasilitas', 'static', 1, 3, NULL, NOW(), NOW()),
    ('30000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'Galeri', 'galeri', 'dynamic', 1, 4, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- ============================================================
-- BANNERS - Bogor Tengah
-- ============================================================
INSERT INTO banners (id, puskesmas_id, image_path, title, description, is_publish, is_deleted, created_at, updated_at)
VALUES 
    ('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'https://placehold.co/1920x600/3b82f6/ffffff?text=Puskes+-+Bogor+Tengah', 'Selamat Datang di Puskesmas Bogor Tengah', 'Melayani dengan hati dan profesional', 1, 0, NOW(), NOW()),
    ('b1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'https://placehold.co/1920x600/3b82f6/ffffff?text=Layanan+IGD+24+Jam', 'IGD 24 Jam', 'Siap melayani kegawatdaruratan medis', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- ============================================================
-- BANNERS - Bogor Utara
-- ============================================================
INSERT INTO banners (id, puskesmas_id, image_path, title, description, is_publish, is_deleted, created_at, updated_at)
VALUES 
    ('b2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'https://placehold.co/1920x600/ef4444/ffffff?text=Puskes+-+Bogor+Utara', 'Selamat Datang di Puskesmas Bogor Utara', 'Kesehatan keluarga adalah prioritas kami', 1, 0, NOW(), NOW()),
    ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'https://placehold.co/1920x600/ef4444/ffffff?text=Poli+Anak', 'Poli Anak', 'Kesehatan balita dan anak', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- ============================================================
-- BANNERS - Bogor Selatan
-- ============================================================
INSERT INTO banners (id, puskesmas_id, image_path, title, description, is_publish, is_deleted, created_at, updated_at)
VALUES 
    ('b3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'https://placehold.co/1920x600/10b981/ffffff?text=Puskes+-+Bogor+Selatan', 'Selamat Datang di Puskesmas Bogor Selatan', 'Bersama menuju sehat', 1, 0, NOW(), NOW()),
    ('b3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'https://placehold.co/1920x600/10b981/ffffff?text=Poli+Gigi', 'Poli Gigi', 'Perawatan gigi dan mulut', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- ============================================================
-- PAGES - Bogor Tengah (with menu_id)
-- ============================================================
INSERT INTO pages (id, puskesmas_id, menu_id, title, dynamic_content, type, status, createdAt, updatedAt)
VALUES 
    ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000004', 'Berita 1 - Bogor Tengah', '<p>Berita terbaru dari Puskesmas Bogor Tengah</p>', 'halaman', 1, NOW(), NOW()),
    ('p1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000004', 'Berita 2 - Bogor Tengah', '<p>Pengumuman penting untuk warga Bogor Tengah</p>', 'halaman', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- ============================================================
-- PAGES - Bogor Utara (with menu_id)
-- ============================================================
INSERT INTO pages (id, puskesmas_id, menu_id, title, dynamic_content, type, status, createdAt, updatedAt)
VALUES 
    ('p2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000004', 'Agenda 1 - Bogor Utara', '<p>Jadwal kegiatan Puskesmas Bogor Utara</p>', 'halaman', 1, NOW(), NOW()),
    ('p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000004', 'Agenda 2 - Bogor Utara', '<p>Pengumuman kegiatan bulan ini</p>', 'halaman', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- ============================================================
-- PAGES - Bogor Selatan (with menu_id)
-- ============================================================
INSERT INTO pages (id, puskesmas_id, menu_id, title, dynamic_content, type, status, createdAt, updatedAt)
VALUES 
    ('p3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000004', 'Galeri 1 - Bogor Selatan', '<p>Kumpulan foto kegiatan Puskesmas Bogor Selatan</p>', 'halaman', 1, NOW(), NOW()),
    ('p3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000004', 'Galeri 2 - Bogor Selatan', '<p>Galeri kegiatan sosial</p>', 'halaman', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- ============================================================
-- AGENDA - Bogor Tengah (correct fields: activity_name, date, time, location)
-- ============================================================
INSERT INTO agenda (id, puskesmas_id, activity_name, date, time, location, effective_date, is_deleted, created_at, updated_at)
VALUES 
    ('ag111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Vaksinasi Anak - Bogor Tengah', '2026-03-15', '08:00:00', 'Ruang Vaccination Center', '2026-03-15', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE activity_name=activity_name;

-- ============================================================
-- AGENDA - Bogor Utara (correct fields)
-- ============================================================
INSERT INTO agenda (id, puskesmas_id, activity_name, date, time, location, effective_date, is_deleted, created_at, updated_at)
VALUES 
    ('ag222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Pemeriksaan Kesehatan Gratis - Bogor Utara', '2026-03-20', '09:00:00', 'Lobby Utama', '2026-03-20', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE activity_name=activity_name;

-- ============================================================
-- AGENDA - Bogor Selatan (correct fields)
-- ============================================================
INSERT INTO agenda (id, puskesmas_id, activity_name, date, time, location, effective_date, is_deleted, created_at, updated_at)
VALUES 
    ('ag333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Posyandu Balita - Bogor Selatan', '2026-03-25', '07:30:00', 'Ruang Pertemuan', '2026-03-25', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE activity_name=activity_name;

-- ============================================================
-- GALLERY - Bogor Tengah (correct fields: image_title, image, upload_date)
-- ============================================================
INSERT INTO gallery (id, puskesmas_id, image_title, image, description, album_id, is_deleted, upload_date)
VALUES 
    ('g1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Ruang Tunggu - Bogor Tengah', 'https://placehold.co/800x600/3b82f6/ffffff?text=Foto+1+Tengah', 'Ruang tunggu yang nyaman', NULL, 0, NOW())
ON DUPLICATE KEY UPDATE image_title=image_title;

-- ============================================================
-- GALLERY - Bogor Utara (correct fields)
-- ============================================================
INSERT INTO gallery (id, puskesmas_id, image_title, image, description, album_id, is_deleted, upload_date)
VALUES 
    ('g2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Ruang Periksa - Bogor Utara', 'https://placehold.co/800x600/ef4444/ffffff?text=Foto+1+Utara', 'Fasilitas pemeriksaan lengkap', NULL, 0, NOW())
ON DUPLICATE KEY UPDATE image_title=image_title;

-- ============================================================
-- GALLERY - Bogor Selatan (correct fields)
-- ============================================================
INSERT INTO gallery (id, puskesmas_id, image_title, image, description, album_id, is_deleted, upload_date)
VALUES 
    ('g3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Ruang Vaksinasi - Bogor Selatan', 'https://placehold.co/800x600/10b981/ffffff?text=Foto+1+Selatan', 'Pemberian vaksin untuk anak', NULL, 0, NOW())
ON DUPLICATE KEY UPDATE image_title=image_title;

-- ============================================================
-- REVIEWS - Bogor Tengah
-- ============================================================
INSERT INTO reviews (id, puskesmas_id, username, message, category, is_publish, created_at, updated_at)
VALUES 
    ('r1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Budi Santoso', 'Pelayanan sangat baik dan ramah', 'Pelayanan', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- ============================================================
-- REVIEWS - Bogor Utara
-- ============================================================
INSERT INTO reviews (id, puskesmas_id, username, message, category, is_publish, created_at, updated_at)
VALUES 
    ('r2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Siti Aminah', 'Dokter sangat ramah dan helpful', 'Tenaga Medis', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- ============================================================
-- REVIEWS - Bogor Selatan
-- ============================================================
INSERT INTO reviews (id, puskesmas_id, username, message, category, is_publish, created_at, updated_at)
VALUES 
    ('r3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Ahmad Wijaya', 'Fasilitas lengkap dan bersih', 'Fasilitas', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- ============================================================
-- CONSULTATIONS - Bogor Tengah (id is AUTO_INCREMENT, insert without id)
-- ============================================================
INSERT INTO consultations (puskesmas_id, username, email, subject, message, is_answer, is_publish, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Dewi', 'dewi@email.com', 'Informasi Vaksinasi', 'Kapan jadwal vaksinasi flu?', 0, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- ============================================================
-- CONSULTATIONS - Bogor Utara (id is AUTO_INCREMENT)
-- ============================================================
INSERT INTO consultations (puskesmas_id, username, email, subject, message, is_answer, is_publish, created_at, updated_at)
VALUES 
    ('22222222-2222-2222-2222-222222222222', 'Rudi', 'rudi@email.com', 'Pemeriksaan Kesehatan', 'Apakah bisa cek tekanan darah?', 0, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- ============================================================
-- CONSULTATIONS - Bogor Selatan (id is AUTO_INCREMENT)
-- ============================================================
INSERT INTO consultations (puskesmas_id, username, email, subject, message, is_answer, is_publish, created_at, updated_at)
VALUES 
    ('33333333-3333-3333-3333-333333333333', 'Lisa', 'lisa@email.com', 'Jam Buka', 'Jam operasional puskesmas?', 0, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
SELECT '3 Puskesmas test data created successfully!' AS message;
