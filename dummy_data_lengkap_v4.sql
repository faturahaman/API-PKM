-- ============================================================
-- DUMMY DATA LENGKAP DENGAN UUID v4
-- PASSWORD SEMUA ADMIN: admin123
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. SUPER ADMIN
-- ============================================================

INSERT INTO admins (id, name, role, password, puskesmas_id, created_at, updated_at) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Superadmin', 'SUPER_ADMIN', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', NULL, NOW(), NOW());


-- ============================================================
-- 2. PUSKESMAS (10 PUSKESMAS)
-- ============================================================

INSERT INTO puskesmas (id, name, slug, status, suspended_reason, suspended_at, suspended_by, deactivated_at, deactivated_by, deactivated_reason, activated_at, activated_by, maintenance_started_at, maintenance_message, created_at, updated_at) VALUES

('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Puskesmas Bogor Tengah', 'pkm-bogor-tengah', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW()),

('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Puskesmas Bogor Utara', 'pkm-bogor-utara', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW()),

('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Puskesmas Bogor Selatan', 'pkm-bogor-selatan', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW()),

('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Puskesmas Tanah Sareal', 'pkm-tanah-sareal', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW()),

('f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Puskesmas Dramaga', 'pkm-dramaga', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW()),

('a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Puskesmas Cibinong', 'pkm-cibinong', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW()),

('b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Puskesmas Citeureup', 'pkm-citeureup', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW()),

('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Puskesmas Sukaraja', 'pkm-sukaraja', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW()),

('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Puskesmas Gunung Putri', 'pkm-gunung-putri', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW()),

('e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Puskesmas Sentul', 'pkm-sentul', 'ACTIVE', NULL, NULL, NULL, NULL, NULL, NULL, NOW(), 'Super Admin', NULL, NULL, NOW(), NOW());


-- ============================================================
-- 3. OPERATOR (1 OPERATOR PER PUSKESMAS)
-- ============================================================

INSERT INTO admins (id, name, role, password, puskesmas_id, created_at, updated_at) VALUES

('f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c', 'OperatorBogorTengah', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', NOW(), NOW()),

('a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d', 'OperatorBogorUtara', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', NOW(), NOW()),

('b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e', 'OperatorBogorSelatan', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', NOW(), NOW()),

('c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f', 'OperatorTanahSareal', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', NOW(), NOW()),

('d6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a', 'OperatorDramaga', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', NOW(), NOW()),

('e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b', 'OperatorCibinong', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', NOW(), NOW()),

('f8a9b0c1-d2e3-4f4a-5b6c-7d8e9f0a1b2c', 'OperatorCiteureup', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', NOW(), NOW()),

('a9b0c1d2-e3f4-4a5b-6c7d-8e9f0a1b2c3d', 'OperatorSukaraja', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', NOW(), NOW()),

('b0c1d2e3-f4a5-4b6c-7d8e-9f0a1b2c3d4e', 'OperatorGunungPutri', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', NOW(), NOW()),

('c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f', 'OperatorSentul', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', NOW(), NOW());


-- ============================================================
-- 4. MENUS (5 MENU UTAMA SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO menus (id, puskesmas_id, title, slug, type, status, `order`, parent_id, createdAt, updatedAt) VALUES

-- Puskesmas Bogor Tengah
('m001-1111-1111-1111-111111111111', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m001-1111-1111-1111-111111111112', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m001-1111-1111-1111-111111111113', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m001-1111-1111-1111-111111111114', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m001-1111-1111-1111-111111111115', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW()),

-- Puskesmas Bogor Utara
('m002-2222-2222-2222-222222222221', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m002-2222-2222-2222-222222222222', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m002-2222-2222-2222-222222222223', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m002-2222-2222-2222-222222222224', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m002-2222-2222-2222-222222222225', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW()),

-- Puskesmas Bogor Selatan
('m003-3333-3333-3333-333333333331', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m003-3333-3333-3333-333333333332', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m003-3333-3333-3333-333333333333', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m003-3333-3333-3333-333333333334', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m003-3333-3333-3333-333333333335', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW()),

-- Puskesmas Tanah Sareal
('m004-4444-4444-4444-444444444441', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m004-4444-4444-4444-444444444442', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m004-4444-4444-4444-444444444443', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m004-4444-4444-4444-444444444444', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m004-4444-4444-4444-444444444445', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW()),

-- Puskesmas Dramaga
('m005-5555-5555-5555-555555555551', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m005-5555-5555-5555-555555555552', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m005-5555-5555-5555-555555555553', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m005-5555-5555-5555-555555555554', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m005-5555-5555-5555-555555555555', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW()),

-- Puskesmas Cibinong
('m006-6666-6666-6666-666666666661', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m006-6666-6666-6666-666666666662', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m006-6666-6666-6666-666666666663', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m006-6666-6666-6666-666666666664', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m006-6666-6666-6666-666666666665', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW()),

-- Puskesmas Citeureup
('m007-7777-7777-7777-777777777771', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m007-7777-7777-7777-777777777772', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m007-7777-7777-7777-777777777773', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m007-7777-7777-7777-777777777774', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m007-7777-7777-7777-777777777775', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW()),

-- Puskesmas Sukaraja
('m008-8888-8888-8888-888888888881', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m008-8888-8888-8888-888888888882', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m008-8888-8888-8888-888888888883', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m008-8888-8888-8888-888888888884', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m008-8888-8888-8888-888888888885', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW()),

-- Puskesmas Gunung Putri
('m009-9999-9999-9999-999999999991', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m009-9999-9999-9999-999999999992', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m009-9999-9999-9999-999999999993', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m009-9999-9999-9999-999999999994', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m009-9999-9999-9999-999999999995', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW()),

-- Puskesmas Sentul
('m010-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Profil', 'profil', 'static', 1, 1, NULL, NOW(), NOW()),
('m010-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Layanan', 'layanan', 'static', 1, 2, NULL, NOW(), NOW()),
('m010-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Berita', 'berita', 'dynamic', 1, 3, NULL, NOW(), NOW()),
('m010-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Pengumuman', 'pengumuman', 'dynamic', 1, 4, NULL, NOW(), NOW()),
('m010-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Kontak', 'kontak', 'static', 1, 5, NULL, NOW(), NOW());


-- ============================================================
-- 5. BANNERS (3 BANNER SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO banners (id, puskesmas_id, image_path, title, description, is_publish, is_deleted, created_at, updated_at) VALUES

-- Puskesmas Bogor Tengah
('bn001-1111-1111-1111-111111111111', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Bogor+Tengah', 'Selamat Datang di Puskesmas Bogor Tengah', 'Melayani masyarakat dengan penuh dedikasi dan professionalism', 1, 0, NOW(), NOW()),
('bn001-2222-2222-2222-222222222222', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'https://placehold.co/1920x600/1565C0/FFFFFF?text=Layanan+Kesehatan+Gratis', 'Layanan Kesehatan Gratis', 'Dapatkan pemeriksaan kesehatan gratis setiap hari Kamis', 1, 0, NOW(), NOW()),
('bn001-3333-3333-3333-333333333333', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'https://placehold.co/1920x600/EF6C00/FFFFFF?text=Program+Imunisasi', 'Program Imunisasi Anak', 'Imunisasi lengkap untuk balita setiap hari Selasa', 1, 0, NOW(), NOW()),

-- Puskesmas Bogor Utara
('bn002-1111-1111-1111-111111111111', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Bogor+Utara', 'Selamat Datang', 'Pelayanan kesehatan terbaik untuk masyarakat', 1, 0, NOW(), NOW()),
('bn002-2222-2222-2222-222222222222', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'https://placehold.co/1920x600/7B1FA2/FFFFFF?text=Pelayanan+Praktik+Dokter', 'Pelayanan Praktik Dokter', 'Dokter umum dan dokter spesialis tersedia', 1, 0, NOW(), NOW()),
('bn002-3333-3333-3333-333333333333', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'https://placehold.co/1920x600/C62828/FFFFFF?text=IGD+24+Jam', 'IGD 24 Jam', 'Layanan gawat darurat siap siaga 24 jam', 1, 0, NOW(), NOW()),

-- Puskesmas Bogor Selatan
('bn003-1111-1111-1111-111111111111', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Bogor+Selatan', 'Kesehatan Keluarga', 'Menuju masyarakat sehat yang berkualitas', 1, 0, NOW(), NOW()),
('bn003-2222-2222-2222-222222222222', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'https://placehold.co/1920x600/00838F/FFFFFF?text=Posyandu+Balita', 'Posyandu Balita', 'Pemantauan tumbuh kembang balita', 1, 0, NOW(), NOW()),
('bn003-3333-3333-3333-333333333333', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'https://placehold.co/1920x600/558B2F/FFFFFF?text=Klinik+Lansia', 'Klinik Lansia', 'Pelayanan kesehatan khusus lansia', 1, 0, NOW(), NOW()),

-- Puskesmas Tanah Sareal
('bn004-1111-1111-1111-111111111111', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Tanah+Sareal', 'Melayani Dengan Hati', 'Profesionalitas tenaga kesehatan kami', 1, 0, NOW(), NOW()),
('bn004-2222-2222-2222-222222222222', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'https://placehold.co/1920x600/AD1457/FFFFFF?text=PELAYANAN+KIA', 'Pelayanan KIA', 'Kesehatan ibu dan anak prioritas kami', 1, 0, NOW(), NOW()),
('bn004-3333-3333-3333-333333333333', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'https://placehold.co/1920x600/6A1B9A/FFFFFF?text=KB+dan+Kontrasepsi', 'KB dan Kontrasepsi', 'Konsultasi dan pelayanan KB gratis', 1, 0, NOW(), NOW()),

-- Puskesmas Dramaga
('bn005-1111-1111-1111-111111111111', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Dramaga', 'Sehat Bersama', 'Membangun generasi sehat', 1, 0, NOW(), NOW()),
('bn005-2222-2222-2222-222222222222', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'https://placehold.co/1920x600/0277BD/FFFFFF?text=Pemeriksaan+Lab', 'Pemeriksaan Laboratorium', 'Hasil cepat dan akurat', 1, 0, NOW(), NOW()),
('bn005-3333-3333-3333-333333333333', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=apotek+24+jam', 'Apotek 24 Jam', 'Obat lengkap tersedia', 1, 0, NOW(), NOW()),

-- Puskesmas Cibinong
('bn006-1111-1111-1111-111111111111', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Cibinong', 'Cibinong Sehat', 'Melayani dengan profesional', 1, 0, NOW(), NOW()),
('bn006-2222-2222-2222-222222222222', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'https://placehold.co/1920x600/E65100/FFFFFF?text=Gigi+dan+Mulut', 'Klinik Gigi dan Mulut', 'Perawatan gigi profesional', 1, 0, NOW(), NOW()),
('bn006-3333-3333-3333-333333333333', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'https://placehold.co/1920x600/1B5E20/FFFFFF?text=Klinik+Mata', 'Klinik Mata', 'Pemeriksaan mata gratis', 1, 0, NOW(), NOW()),

-- Puskesmas Citeureup
('bn007-1111-1111-1111-111111111111', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Citeureup', 'Citeureup Care', 'Kesehatan masyarakat prioritas', 1, 0, NOW(), NOW()),
('bn007-2222-2222-2222-222222222222', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'https://placehold.co/1920x600/4527A0/FFFFFF?text=Rawat+Jalan', 'Pelayanan Rawat Jalan', 'Konsultasi dokter umum', 1, 0, NOW(), NOW()),
('bn007-3333-3333-3333-333333333333', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'https://placehold.co/1920x600/00695C/FFFFFF?text=Penyakit+Menular', 'Pencegahan Penyakit Menular', 'Vaksinasi dan edukasi', 1, 0, NOW(), NOW()),

-- Puskesmas Sukaraja
('bn008-1111-1111-1111-111111111111', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Sukaraja', 'Sukaraja Sejahtera', 'Masyarakat sehat adalah tujuan kami', 1, 0, NOW(), NOW()),
('bn008-2222-2222-2222-222222222222', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'https://placehold.co/1920x600/283593/FFFFFF?text=Konsultasi+Gizi', 'Klinik Gizi', 'Konsultasi nutrisi dan diet', 1, 0, NOW(), NOW()),
('bn008-3333-3333-3333-333333333333', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'https://placehold.co/1920x600/BCAAA4/FFFFFF?text=Fisioterapi', 'Layanan Fisioterapi', 'Pemulihan fungsi tubuh', 1, 0, NOW(), NOW()),

-- Puskesmas Gunung Putri
('bn009-1111-1111-1111-111111111111', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Gunung+Putri', 'Gunung Putri Healthy', 'Bersama menuju hidup sehat', 1, 0, NOW(), NOW()),
('bn009-2222-2222-2222-222222222222', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'https://placehold.co/1920x600/D84315/FFFFFF?text=P3K+Komunitas', 'Pelayanan P3K Komunitas', 'Pertolongan pertama darurat', 1, 0, NOW(), NOW()),
('bn009-3333-3333-3333-333333333333', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'https://placehold.co/1920x600/1565C0/FFFFFF?text=Skrining+Kesehatan', 'Skrining Kesehatan Gratis', 'Deteksi dini penyakit', 1, 0, NOW(), NOW()),

-- Puskesmas Sentul
('bn010-1111-1111-1111-111111111111', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'https://placehold.co/1920x600/2E7D32/FFFFFF?text=Puskesmas+Sentul', 'Sentul Wellness', 'Kesehatan terbaik untuk Anda', 1, 0, NOW(), NOW()),
('bn010-2222-2222-2222-222222222222', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'https://placehold.co/1920x600/00897B/FFFFFF?text=Yoga+dan+Meditasi', 'Program Wellness', 'Yoga dan meditasi sehat', 1, 0, NOW(), NOW()),
('bn010-3333-3333-3333-333333333333', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'https://placehold.co/1920x600/5D4037/FFFFFF?text=Herbal+Medicine', 'Pengobatan Herbal', 'Layanan tradisional terintegrasi', 1, 0, NOW(), NOW());


-- ============================================================
-- 6. PAGES / BERITA (2-3 BERITA SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO pages (id, puskesmas_id, menu_id, title, dynamic_content, type, status, createdAt, updatedAt) VALUES

-- Berita Puskesmas Bogor Tengah
('pg001-1111-1111-1111-111111111111', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'm001-1111-1111-1111-111111111113', 'Vaksinasi Gratis Bulan Ini', '<h2>Vaksinasi Gratis untuk Masyarakat</h2><p>Puskesmas Bogor Tengah kembali memberikan layanan vaksinasi gratis untuk seluruh masyarakat. Vaksinasi ini meliputi vaksin DT, TT, dan流感. Jadwal pelayanan setiap hari Senin hingga Jumat pukul 08.00-12.00 WIB.</p><p><strong>Syarat:</strong></p><ul><li>Membawa KTP</li><li>Membawa Kartu Keluarga</li><li> usia minimal 1 tahun</li></ul>', 'halaman', 1, NOW(), NOW()),
('pg001-2222-2222-2222-222222222222', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'm001-1111-1111-1111-111111111113', 'Cek Kesehatan Gratis Setiap Kamis', '<h2>Pemeriksaan Kesehatan Gratis</h2><p>Setiap hari Kamis, Puskesmas Bogor Tengah memberikan pemeriksaan kesehatan gratis bagi masyarakat. Pemeriksaan meliputi tekanan darah, gula darah, kolestrol, dan berat badan.</p><p>Daftar sekarang sebelum jadwal penuh!</p>', 'halaman', 1, NOW(), NOW()),
('pg001-3333-3333-3333-333333333333', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'm001-1111-1111-1111-111111111114', 'Jadwal Posyandu Bulan Maret 2026', '<h2>Jadwal Posyandu</h2><p>Berikut adalah jadwal posyandu untuk bulan Maret 2026:</p><ul><li>Posyandu Mawar: Tanggal 5 Maret</li><li>Posyandu Melati: Tanggal 12 Maret</li><li>Posyandu Daisy: Tanggal 19 Maret</li><li>Posyandu Edelweis: Tanggal 26 Maret</li></ul>', 'halaman', 1, NOW(), NOW()),

-- Berita Puskesmas Bogor Utara
('pg002-1111-1111-1111-111111111111', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'm002-2222-2222-2222-222222222223', 'Program Imunisasi Anak Lengkap', '<h2>Imunisasi Lengkap untuk Balita</h2><p>Puskesmas Bogor Utara mengajak orang tua untuk membawa anak-anak mereka mendapatkan imunisasi lengkap. Program ini gratuito dan sangat penting untuk kesehatan anak.</p>', 'halaman', 1, NOW(), NOW()),
('pg002-2222-2222-2222-222222222222', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'm002-2222-2222-2222-222222222223', 'Pelayanan Gigi Gratis', '<h2>Klinik Gigi Buka Setiap Hari</h2><p>Layanan pemeriksaan dan perawatan gigi tersedia gratis setiap hari. Booking dapat dilakukan secara online melalui website kami.</p>', 'halaman', 1, NOW(), NOW()),

-- Berita Puskesmas Bogor Selatan
('pg003-1111-1111-1111-111111111111', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'm003-3333-3333-3333-333333333333', 'Seminar Kesehatan Keluarga', '<h2>Seminar Kesehatan Gratis</h2><p>Ikuti seminar kesehatan keluarga yang akan diselenggarakan pada tanggal 20 Maret 2026. Topik meliputi nutrisi seimbang dan pencegahan penyakit degeneratif.</p>', 'halaman', 1, NOW(), NOW()),
('pg003-2222-2222-2222-222222222222', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'm003-3333-3333-3333-333333333334', 'Pengumuman Libur Nasional', '<h2>Informasi Layanan Selama Libur</h2><p>Puskesmas Bogor Selatan tetap buka selama libur nasional dengan layanan darurat. Poli reguler akan kembali beroperasi tanggal 8 April 2026.</p>', 'halaman', 1, NOW(), NOW()),

-- Berita Puskesmas Tanah Sareal
('pg004-1111-1111-1111-111111111111', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'm004-4444-4444-4444-444444444443', 'Pelayanan KIA Terbaru', '<h2>Layanan Kesehatan Ibu dan Anak</h2><p>Puskesmas Tanah Sareal kini memiliki layanan KIA yang lebih lengkap dengan peralatan modern. Dapatkan pelayanan terbaik untuk ibu hamil dan balita.</p>', 'halaman', 1, NOW(), NOW()),

-- Berita Puskesmas Dramaga
('pg005-1111-1111-1111-111111111111', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'm005-5555-5555-5555-555555555553', 'Pemeriksaan Laboratorium Lengkap', '<h2>Layanan Lab Modern</h2><p>Kami kini memiliki peralatan laboratorium terbaru untuk pemeriksaan darah, urine, dan fungsi organ lainnya. Hasil dapat diperoleh dalam hitungan jam.</p>', 'halaman', 1, NOW(), NOW()),

-- Berita Puskesmas Cibinong
('pg006-1111-1111-1111-111111111111', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'm006-6666-6666-6666-666666666663', 'Klinik Mata Baru', '<h2>Layanan Kesehatan Mata</h2><p>Puskesmas Cibinong kini memiliki klinik mata dengan dokter spesialis. Pemeriksaan mata gratis setiap hari Sabtu.</p>', 'halaman', 1, NOW(), NOW()),

-- Berita Puskesmas Citeureup
('pg007-1111-1111-1111-111111111111', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'm007-7777-7777-7777-777777777773', 'Pencegahan DBD', '<h2>Gerakan 3M Plus</h2><p>Ikuti gerakan pemberantasan nyamuk Aedes Aegypti. Fogging akan dilakukan secara berkala di lingkungan perumahan.</p>', 'halaman', 1, NOW(), NOW()),

-- Berita Puskesmas Sukaraja
('pg008-1111-1111-1111-111111111111', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'm008-8888-8888-8888-888888888883', 'Klinik Gizi Konsultasi', '<h2>Layanan Konsultasi Gizi</h2><p>Dapatkan konsultasi nutrisi dari ahli gizi kami. Program diet sehat dan penanganan gizi buruk tersedia.</p>', 'halaman', 1, NOW(), NOW()),

-- Berita Puskesmas Gunung Putri
('pg009-1111-1111-1111-111111111111', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'm009-9999-9999-9999-999999999993', 'Skrining Diabetes Gratis', '<h2>Deteksi Dini Diabetes</h2><p>Skrining gula darah gratis tersedia untuk masyarakat. Deteksi dini dapat mencegah komplikasi yang lebih serius.</p>', 'halaman', 1, NOW(), NOW()),

-- Berita Puskesmas Sentul
('pg010-1111-1111-1111-111111111111', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'm010-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Program Wellness Center', '<h2>Puskesmas Sentul Wellness</h2><p>Kami membuka program wellness center dengan layanan yoga, meditasi, dan pengobatan herbal tradisional yang aman dan terpercaya.</p>', 'halaman', 1, NOW(), NOW());


-- ============================================================
-- 7. REVIEWS (2-3 REVIEW SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO reviews (id, puskesmas_id, username, message, category, is_publish, created_at, updated_at) VALUES

-- Reviews Bogor Tengah
('rv001-1111-1111-1111-111111111111', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Budi Santoso', 'Pelayanan sangat baik dan ramah. Dokter memberikan waktu yang cukup untuk konsultasi.', 'Pelayanan', 1, NOW(), NOW()),
('rv001-2222-2222-2222-222222222222', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Siti Rahayu', 'Tempat bersih dan rapi. Proses pendaftaran cepat.', 'Fasilitas', 1, NOW(), NOW()),
('rv001-3333-3333-3333-333333333333', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Dr. Ahmad', 'Dokter dan perawat sangat profesional dan helpful.', 'Tenaga Medis', 1, NOW(), NOW()),

-- Reviews Bogor Utara
('rv002-1111-1111-1111-111111111111', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Rinawati', 'Sangat memuaskan! Anak saya tidak takut ke dokter lagi.', 'Pelayanan', 1, NOW(), NOW()),
('rv002-2222-2222-2222-222222222222', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Hendra', 'Layanan igd 24 jam sangat membantu saat darurat.', 'Pelayanan', 1, NOW(), NOW()),

-- Reviews Bogor Selatan
('rv003-1111-1111-1111-111111111111', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Dewi Lestari', 'Program posyandu sangat berguna untuk balita.', 'Lainnya', 1, NOW(), NOW()),

-- Reviews Tanah Sareal
('rv004-1111-1111-1111-111111111111', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Joko Pramono', 'Pelayanan KB sangat lengkap dan konsultatif.', 'Pelayanan', 1, NOW(), NOW()),

-- Reviews Dramaga
('rv005-1111-1111-1111-111111111111', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Nita Wahyuni', 'Hasil lab cepat dan akurat. 推荐!', 'Fasilitas', 1, NOW(), NOW()),

-- Reviews Cibinong
('rv006-1111-1111-1111-111111111111', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Reza Maulana', 'Klinik gigi terbaik di daerah ini.', 'Tenaga Medis', 1, NOW(), NOW()),

-- Reviews Citeureup
('rv007-1111-1111-1111-111111111111', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Lisa Amelia', 'Pencegahan DBT sangat aktif di komunitas kami.', 'Lainnya', 1, NOW(), NOW()),

-- Reviews Sukaraja
('rv008-1111-1111-1111-111111111111', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Pak Umar', 'Konsultasi gizi sangat membantu menjaga berat badan.', 'Pelayanan', 1, NOW(), NOW()),

-- Reviews Gunung Putri
('rv009-1111-1111-1111-111111111111', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Maya Putri', 'Skrining diabetes gratis sangat membantu.', 'Lainnya', 1, NOW(), NOW()),

-- Reviews Sentul
('rv010-1111-1111-1111-111111111111', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Tony Hartono', 'Program wellness sangat baik untuk kesehatan.', 'Lainnya', 1, NOW(), NOW());


-- ============================================================
-- 8. CONSULTATIONS (2 KONSULTASI SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO consultations (puskesmas_id, username, email, subject, message, is_answer, is_publish, created_at, updated_at) VALUES

('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Dewi', 'dewi@example.com', 'Jadwal Vaksinasi', 'Kapan tepatnya jadwal vaksinasi bulan ini?', 0, 1, NOW(), NOW()),
('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Rudi', 'rudi@example.com', 'Cek Tekanan Darah', 'Apakah bisa cek tekanan darah tanpa appointment?', 0, 1, NOW(), NOW()),

('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Ani', 'ani@example.com', 'Imunisasi Anak', 'Berapa usia minimal anak untuk imunisasi?', 0, 1, NOW(), NOW()),
('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Bambang', 'bambang@example.com', 'Layanan Gigi', 'Apakah ada dokter gigi hari Sabtu?', 0, 1, NOW(), NOW()),

('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Wati', 'wati@example.com', 'Posyandu', 'Apakah posyandu buka hari Minggu?', 0, 1, NOW(), NOW()),
('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Heri', 'heri@example.com', 'Seminar Kesehatan', 'Bagaimana cara daftar seminar?', 0, 1, NOW(), NOW()),

('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Yanti', 'yanti@example.com', 'Layanan KIA', 'Apakah ada USG di puskesmas?', 0, 1, NOW(), NOW()),
('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Dedi', 'dedi@example.com', 'KB', 'Apa saja metode KB yang tersedia?', 0, 1, NOW(), NOW()),

('f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Sari', 'sari@example.com', 'Pemeriksaan Lab', 'Berapa biaya pemeriksaan darah lengkap?', 0, 1, NOW(), NOW()),
('f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Asep', 'asep@example.com', 'Apotek', 'Apakah obat BPJS tersedia lengkap?', 0, 1, NOW(), NOW()),

('a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Rina', 'rina@example.com', 'Klinik Mata', 'Apakah ada Operasi Katarak?', 0, 1, NOW(), NOW()),
('a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Fajar', 'fajar@example.com', 'Perawatan Gigi', 'Berapa biaya tambal gigi?', 0, 1, NOW(), NOW()),

('b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Nurul', 'nurul@example.com', 'DBD', 'Kapan fogging dilakukan di lingkungan kami?', 0, 1, NOW(), NOW()),
('b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Doni', 'doni@example.com', 'Vaksin', 'Apakah ada vaksin COVID-19?', 0, 1, NOW(), NOW()),

('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Melly', 'melly@example.com', 'Gizi', 'Bagaimana cara mengatasi anak kurang gizi?', 0, 1, NOW(), NOW()),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Yoga', 'yoga@example.com', 'Diet', 'Apakah ada program diet khusus?', 0, 1, NOW(), NOW()),

('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Indra', 'indra@example.com', 'Diabetes', 'Bagaimana cara mencegah diabetes?', 0, 1, NOW(), NOW()),
('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Tika', 'tika@example.com', 'Skrining', 'Apakah skrining gula darah puasa?', 0, 1, NOW(), NOW()),

('e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Ricky', 'ricky@example.com', 'Wellness', 'Apa saja layanan wellness center?', 0, 1, NOW(), NOW()),
('e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Vina', 'vina@example.com', 'Yoga', 'Apakah kelas yoga berbayar?', 0, 1, NOW(), NOW());


-- ============================================================
-- 9. AGENDA (2 AGENDA SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO agenda (id, puskesmas_id, activity_name, date, time, location, effective_date, is_deleted, created_at, updated_at) VALUES

-- Agenda Bogor Tengah
('ag001-1111-1111-1111-111111111111', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Vaksinasi Massal', '2026-04-15', '08:00', 'Aula Puskesmas Bogor Tengah', '2026-04-15', false, NOW(), NOW()),
('ag001-2222-2222-2222-222222222222', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Cek Kesehatan Gratis', '2026-04-20', '08:00', 'Lorong Utama', '2026-04-20', false, NOW(), NOW()),

-- Agenda Bogor Utara
('ag002-1111-1111-1111-111111111111', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Imunisasi Anak', '2026-04-10', '09:00', 'Ruang KIA', '2026-04-10', false, NOW(), NOW()),
('ag002-2222-2222-2222-222222222222', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Pemeriksaan Gigi', '2026-04-18', '08:00', 'Klinik Gigi', '2026-04-18', false, NOW(), NOW()),

-- Agenda Bogor Selatan
('ag003-1111-1111-1111-111111111111', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Seminar Kesehatan Keluarga', '2026-04-22', '10:00', 'Aula Utama', '2026-04-22', false, NOW(), NOW()),
('ag003-2222-2222-2222-222222222222', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Posyandu Balita', '2026-04-05', '08:00', 'Gedung Posyandu', '2026-04-05', false, NOW(), NOW()),

-- Agenda Tanah Sareal
('ag004-1111-1111-1111-111111111111', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Pelayanan KB', '2026-04-12', '08:00', 'Ruang KB', '2026-04-12', false, NOW(), NOW()),
('ag004-2222-2222-2222-222222222222', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Pemeriksaan Ibu Hamil', '2026-04-19', '08:00', 'Ruang KIA', '2026-04-19', false, NOW(), NOW()),

-- Agenda Dramaga
('ag005-1111-1111-1111-111111111111', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Pemeriksaan Lab Massal', '2026-04-08', '07:00', 'Laboratorium', '2026-04-08', false, NOW(), NOW()),
('ag005-2222-2222-2222-222222222222', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Apotek Keliling', '2026-04-25', '09:00', 'Halaman Puskesmas', '2026-04-25', false, NOW(), NOW()),

-- Agenda Cibinong
('ag006-1111-1111-1111-111111111111', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Pemeriksaan Mata Gratis', '2026-04-14', '08:00', 'Klinik Mata', '2026-04-14', false, NOW(), NOW()),
('ag006-2222-2222-2222-222222222222', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Operasi Katarak', '2026-04-28', '07:00', 'Ruang Operasi', '2026-04-28', false, NOW(), NOW()),

-- Agenda Citeureup
('ag007-1111-1111-1111-111111111111', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Foging Fogging', '2026-04-11', '05:00', 'Komunitas Perumahan', '2026-04-11', false, NOW(), NOW()),
('ag007-2222-2222-2222-222222222222', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Edukasi DB', '2026-04-18', '10:00', 'Aula Puskesmas', '2026-04-18', false, NOW(), NOW()),

-- Agenda Sukaraja
('ag008-1111-1111-1111-111111111111', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Konsultasi Gizi', '2026-04-09', '08:00', 'Ruang Gizi', '2026-04-09', false, NOW(), NOW()),
('ag008-2222-2222-2222-222222222222', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Program Diet Sehat', '2026-04-23', '09:00', 'Aula', '2026-04-23', false, NOW(), NOW()),

-- Agenda Gunung Putri
('ag009-1111-1111-1111-111111111111', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Skrining Diabetes', '2026-04-07', '07:00', 'Lorong Utama', '2026-04-07', false, NOW(), NOW()),
('ag009-2222-2222-2222-222222222222', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'P3K Komunitas', '2026-04-21', '13:00', 'Aula', '2026-04-21', false, NOW(), NOW()),

-- Agenda Sentul
('ag010-1111-1111-1111-111111111111', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Yoga dan Meditasi', '2026-04-06', '06:00', 'Taman Wellness', '2026-04-06', false, NOW(), NOW()),
('ag010-2222-2222-2222-222222222222', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Pengobatan Herbal', '2026-04-20', '10:00', 'Ruang Terapi', '2026-04-20', false, NOW(), NOW());


-- ============================================================
-- 10. ALBUMS (1 ALBUM SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO albums (id, puskesmas_id, album_title, description, album_cover, count, created_at, updated_at) VALUES

('al001-1111-1111-1111-111111111111', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Album Kegiatan Puskesmas Bogor Tengah', 'Dokumentasi berbagai kegiatan kesehatan', 'https://placehold.co/400x300/2E7D32/FFFFFF?text=Album+Kegiatan', 5, NOW(), NOW()),

('al002-2222-2222-2222-222222222222', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Album Kesehatan Masyarakat', 'Program pelayanan kesehatan aktif', 'https://placehold.co/400x300/1565C0/FFFFFF?text=Kesehatan+Masyarakat', 4, NOW(), NOW()),

('al003-3333-3333-3333-333333333333', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Album Posyandu', 'Activities posyandu balita dan lansia', 'https://placehold.co/400x300/00838F/FFFFFF?text=Posyandu', 3, NOW(), NOW()),

('al004-4444-4444-4444-444444444444', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Album KIA', 'Pelayanan kesehatan ibu dan anak', 'https://placehold.co/400x300/AD1457/FFFFFF?text=KIA', 4, NOW(), NOW()),

('al005-5555-5555-5555-555555555555', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Album Laboratorium', 'Fasilitas dan peralatan laboratorium', 'https://placehold.co/400x300/0277BD/FFFFFF?text=Laboratorium', 3, NOW(), NOW()),

('al006-6666-6666-6666-666666666666', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Album Klinik Spesialis', 'Klinik gigi dan mata', 'https://placehold.co/400x300/E65100/FFFFFF?text=Klinik+Spesialis', 4, NOW(), NOW()),

('al007-7777-7777-7777-777777777777', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Album Pencegahan Penyakit', 'Program pencegahan dan edukasi', 'https://placehold.co/400x300/4527A0/FFFFFF?text=Pencegahan', 3, NOW(), NOW()),

('al008-8888-8888-8888-888888888888', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Album Gizi', 'Program konsultasi dan seminar gizi', 'https://placehold.co/400x300/283593/FFFFFF?text=Gizi', 3, NOW(), NOW()),

('al009-9999-9999-9999-999999999999', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Album Skrining', 'Skrining kesehatan massal', 'https://placehold.co/400x300/D84315/FFFFFF?text=Skrining', 3, NOW(), NOW()),

('al010-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Album Wellness', 'Program wellness dan sehat', 'https://placehold.co/400x300/00897B/FFFFFF?text=Wellness', 4, NOW(), NOW());


-- ============================================================
-- 11. GALLERY (3-4 FOTO SETIAP ALBUM)
-- ============================================================

INSERT INTO gallery (id, puskesmas_id, image_title, image, description, album_id, is_deleted, upload_date) VALUES

-- Gallery Bogor Tengah
('gl001-1111-1111-1111-111111111111', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Vaksinasi Massal', 'https://placehold.co/800x600/2E7D32/FFFFFF?text=Vaksinasi+Massal', 'Pelaksanaan vaksinasi massal', 'al001-1111-1111-1111-111111111111', false, NOW()),
('gl001-2222-2222-2222-222222222222', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Cek Kesehatan', 'https://placehold.co/800x600/1565C0/FFFFFF?text=Cek+Kesehatan', 'Pemeriksaan kesehatan gratis', 'al001-1111-1111-1111-111111111111', false, NOW()),
('gl001-3333-3333-3333-333333333333', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Posyandu', 'https://placehold.co/800x600/00838F/FFFFFF?text=Posyandu', 'Posyandu balita', 'al001-1111-1111-1111-111111111111', false, NOW()),
('gl001-4444-4444-4444-444444444444', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Edukasi Kesehatan', 'https://placehold.co/800x600/AD1457/FFFFFF?text=Edukasi', 'Edukasi kepada masyarakat', 'al001-1111-1111-1111-111111111111', false, NOW()),
('gl001-5555-5555-5555-555555555555', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Pelayanan Loket', 'https://placehold.co/800x600/4527A0/FFFFFF?text=Loket+Pelayanan', 'Pelayanan loket puskesmas', 'al001-1111-1111-1111-111111111111', false, NOW()),

-- Gallery Bogor Utara
('gl002-1111-1111-1111-111111111111', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Imunisasi Anak', 'https://placehold.co/800x600/2E7D32/FFFFFF?text=Imunisasi', 'Imunisasi anak usia dini', 'al002-2222-2222-2222-222222222222', false, NOW()),
('gl002-2222-2222-2222-222222222222', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Pemeriksaan Gigi', 'https://placehold.co/800x600/E65100/FFFFFF?text=Periksa+Gigi', 'Pemeriksaan gigi gratis', 'al002-2222-2222-2222-222222222222', false, NOW()),
('gl002-3333-3333-3333-333333333333', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'IGD 24 Jam', 'https://placehold.co/800x600/C62828/FFFFFF?text=IGD', 'Layanan IGD siap 24 jam', 'al002-2222-2222-2222-222222222222', false, NOW()),
('gl002-4444-4444-4444-444444444444', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Poli Umum', 'https://placehold.co/800x600/0277BD/FFFFFF?text=Poli+Umum', 'Pelayanan poli umum', 'al002-2222-2222-2222-222222222222', false, NOW()),

-- Gallery Bogor Selatan
('gl003-1111-1111-1111-111111111111', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Seminar Kesehatan', 'https://placehold.co/800x600/2E7D32/FFFFFF?text=Seminar', 'Seminar kesehatan keluarga', 'al003-3333-3333-3333-333333333333', false, NOW()),
('gl003-2222-2222-2222-222222222222', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Posyandu Lansia', 'https://placehold.co/800x600/558B2F/FFFFFF?text=Posyandu+Lansia', 'Posyandu untuk lansia', 'al003-3333-3333-3333-333333333333', false, NOW()),
('gl003-3333-3333-3333-333333333333', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Timbang Balita', 'https://placehold.co/800x600/00838F/FFFFFF?text=Timbang+Balita', 'Penimbangan balita', 'al003-3333-3333-3333-333333333333', false, NOW()),

-- Gallery Tanah Sareal
('gl004-1111-1111-1111-111111111111', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Pelayanan KB', 'https://placehold.co/800x600/AD1457/FFFFFF?text=Pelayanan+KB', 'Servis KB gratis', 'al004-4444-4444-4444-444444444444', false, NOW()),
('gl004-2222-2222-2222-222222222222', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Periksa Ibu Hamil', 'https://placehold.co/800x600/6A1B9A/FFFFFF?text=Ibu+Hamil', 'Pemeriksaan kehamilan', 'al004-4444-4444-4444-444444444444', false, NOW()),
('gl004-3333-3333-3333-333333333333', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'USG', 'https://placehold.co/800x600/2E7D32/FFFFFF?text=USG', 'Pemeriksaan USG', 'al004-4444-4444-4444-444444444444', false, NOW()),
('gl004-4444-4444-4444-444444444444', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Konseling', 'https://placehold.co/800x600/4527A0/FFFFFF?text=Konseling', 'Konseling kesehatan', 'al004-4444-4444-4444-444444444444', false, NOW()),

-- Gallery Dramaga
('gl005-1111-1111-1111-111111111111', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Laboratorium', 'https://placehold.co/800x600/0277BD/FFFFFF?text=Laboratorium', 'Fasilitas lab lengkap', 'al005-5555-5555-5555-555555555555', false, NOW()),
('gl005-2222-2222-2222-222222222222', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Apotek', 'https://placehold.co/800x600/2E7D32/FFFFFF?text=Apotek', 'Apotek 24 jam', 'al005-5555-5555-5555-555555555555', false, NOW()),
('gl005-3333-3333-3333-333333333333', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Rawat Jalan', 'https://placehold.co/800x600/00838F/FFFFFF?text=Rawat+Jalan', 'Pelayanan rawat jalan', 'al005-5555-5555-5555-555555555555', false, NOW()),

-- Gallery Cibinong
('gl006-1111-1111-1111-111111111111', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Klinik Mata', 'https://placehold.co/800x600/1B5E20/FFFFFF?text=Klinik+Mata', 'Pemeriksaan mata', 'al006-6666-6666-6666-666666666666', false, NOW()),
('gl006-2222-2222-2222-222222222222', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Klinik Gigi', 'https://placehold.co/800x600/E65100/FFFFFF?text=Klinik+Gigi', 'Perawatan gigi', 'al006-6666-6666-6666-666666666666', false, NOW()),
('gl006-3333-3333-3333-333333333333', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Operasi', 'https://placehold.co/800x600/C62828/FFFFFF?text=Operasi', 'Ruang operasi', 'al006-6666-6666-6666-666666666666', false, NOW()),
('gl006-4444-4444-4444-444444444444', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Perawat', 'https://placehold.co/800x600/1565C0/FFFFFF?text=Perawat', 'Tim perawat profesional', 'al006-6666-6666-6666-666666666666', false, NOW()),

-- Gallery Citeureup
('gl007-1111-1111-1111-111111111111', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Foging', 'https://placehold.co/800x600/4527A0/FFFFFF?text=Fogging', 'Foging pemberantas nyamuk', 'al007-7777-7777-7777-777777777777', false, NOW()),
('gl007-2222-2222-2222-222222222222', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Edukasi DB', 'https://placehold.co/800x600/00695C/FFFFFF?text=Edukasi+DB', 'Edukasi pencegahan DBD', 'al007-7777-7777-7777-777777777777', false, NOW()),
('gl007-3333-3333-3333-333333333333', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'PSN', 'https://placehold.co/800x600/558B2F/FFFFFF?text=PSN', 'Pemantauan sarang nyamuk', 'al007-7777-7777-7777-777777777777', false, NOW()),

-- Gallery Sukaraja
('gl008-1111-1111-1111-111111111111', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Konsultasi Gizi', 'https://placehold.co/800x600/283593/FFFFFF?text=Konsultasi+Gizi', 'Konsultasi dengan ahli gizi', 'al008-8888-8888-8888-888888888888', false, NOW()),
('gl008-2222-2222-2222-222222222222', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', ' Seminar Gizi', 'https://placehold.co/800x600/BCAAA4/FFFFFF?text=Seminar+Gizi', 'Seminar nutrisi seimbang', 'al008-8888-8888-8888-888888888888', false, NOW()),
('gl008-3333-3333-3333-333333333333', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Fisioterapi', 'https://placehold.co/800x600/00695C/FFFFFF?text=Fisioterapi', 'Layanan fisioterapi', 'al008-8888-8888-8888-888888888888', false, NOW()),

-- Gallery Gunung Putri
('gl009-1111-1111-1111-111111111111', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Skrining Diabetes', 'https://placehold.co/800x600/D84315/FFFFFF?text=Skrining+Diabetes', 'Skrining gula darah', 'al009-9999-9999-9999-999999999999', false, NOW()),
('gl009-2222-2222-2222-222222222222', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'P3K Komunitas', 'https://placehold.co/800x600/1565C0/FFFFFF?text=P3K+Komunitas', 'Pelatihan P3K', 'al009-9999-9999-9999-999999999999', false, NOW()),
('gl009-3333-3333-3333-333333333333', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Health Talk', 'https://placehold.co/800x600/2E7D32/FFFFFF?text=Health+Talk', 'Diskusi kesehatan', 'al009-9999-9999-9999-999999999999', false, NOW()),

-- Gallery Sentul
('gl010-1111-1111-1111-111111111111', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Yoga', 'https://placehold.co/800x600/00897B/FFFFFF?text=Yoga', 'Kelas yoga massal', 'al010-aaaa-aaaa-aaaa-aaaaaaaaaaaa', false, NOW()),
('gl010-2222-2222-2222-222222222222', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Meditasi', 'https://placehold.co/800x600/5D4037/FFFFFF?text=Meditasi', 'Sesi meditasi', 'al010-aaaa-aaaa-aaaa-aaaaaaaaaaaa', false, NOW()),
('gl010-3333-3333-3333-333333333333', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Pengobatan Herbal', 'https://placehold.co/800x600/2E7D32/FFFFFF?text=Herbal', 'Layanan herbal', 'al010-aaaa-aaaa-aaaa-aaaaaaaaaaaa', false, NOW()),
('gl010-4444-4444-4444-444444444444', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Wellness', 'https://placehold.co/800x600/00897B/FFFFFF?text=Wellness', 'Program wellness', 'al010-aaaa-aaaa-aaaa-aaaaaaaaaaaa', false, NOW());


-- ============================================================
-- 12. KRITIK DAN SARAN (2 SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO kritik_saran (id, nama, email, no_hp, pesan, kategori, status, puskesmas_id, created_at, updated_at) VALUES

('ks001-1111-1111-1111-111111s111111', 'Ahmad Fauzi', 'ahmad@example.com', '081234567890', 'Pelayanan sudah baik, tapi diharapkan menambah loket pembayaran agar tidak terlalu lama.', 'kritik', 2, 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', NOW(), NOW()),
('ks001-2222-2222-2222-222222222222', 'Lisa Permata', 'lisa@example.com', '081234567891', 'Saran: tambahkan jadwal dokter spesialis pada hari weekend.', 'saran', 1, 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', NOW(), NOW()),

('ks002-1111-1111-1111-111111111111', 'Budi Hermawan', 'budi@example.com', '081234567892', 'Mohon diperbaiki sistem antrian online yang sering error.', 'kritik', 1, 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', NOW(), NOW()),
('ks002-2222-2222-2222-222222222222', 'Siti Nurhaliza', 'siti@example.com', '081234567893', 'Terima kasih atas layanan igd 24 jam yang sangat membantu.', 'saran', 2, 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', NOW(), NOW()),

('ks003-1111-1111-1111-111111111111', 'Rendi Kurniawan', 'rendi@example.com', '081234567894', 'Saran: tambahkan tempat duduk yang lebih nyaman di ruang tunggu.', 'saran', 1, 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', NOW(), NOW()),
('ks003-2222-2222-2222-222222222222', 'Dewi Sartika', 'dewi@example.com', '081234567895', 'Pelayanan posyandu sangat memuaskan, tetap semangat!', 'kritik', 2, 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', NOW(), NOW()),

('ks004-1111-1111-1111-111111111111', 'Hendra Wijaya', 'hendra@example.com', '081234567896', 'Mohon ditambah jadwal USG agar lebih fleksibel.', 'saran', 0, 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', NOW(), NOW()),
('ks004-2222-2222-2222-222222222222', 'Nurul Huda', 'nurul@example.com', '081234567897', 'Pelayanan KB sangat membantu, dokter sangat ramah.', 'kritik', 2, 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', NOW(), NOW()),

('ks005-1111-1111-1111-111111111111', 'Fajar Santoso', 'fajar@example.com', '081234567898', 'Saran: informasikan nomor antrian via SMS.', 'saran', 1, 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', NOW(), NOW()),
('ks005-2222-2222-2222-222222222222', 'Ratna Sari', 'ratna@example.com', '081234567899', 'Pelayanan laboratorium cepat dan akurat.', 'kritik', 2, 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', NOW(), NOW()),

('ks006-1111-1111-1111-111111111111', 'Doni Kusuma', 'doni@example.com', '081234567800', 'Mohon diperbaiki AC di ruang tunggu yang kurang dingin.', 'kritik', 1, 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', NOW(), NOW()),
('ks006-2222-2222-2222-222222222222', 'Intan Paramita', 'intan@example.com', '081234567801', 'Klinik mata sangat membantu, terima kasih.', 'saran', 2, 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', NOW(), NOW()),

('ks007-1111-1111-1111-111111111111', 'Rizky Akbar', 'rizky@example.com', '081234567802', 'Saran: lakukan fogging lebih sering di musim hujan.', 'saran', 0, 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', NOW(), NOW()),
('ks007-2222-2222-2222-222222222222', 'Maya Luhur', 'maya@example.com', '081234567803', 'Pelayanan edukasi DBD sangat edukatif.', 'kritik', 2, 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', NOW(), NOW()),

('ks008-1111-1111-1111-111111111111', 'Yoga Pratama', 'yoga@example.com', '081234567804', 'Mohon ditambah waktu konsultasi gizi.', 'saran', 1, 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', NOW(), NOW()),
('ks008-2222-2222-2222-222222222222', 'Tika Melati', 'tika@example.com', '081234567805', 'Program diet sehat sangat membantu.', 'kritik', 2, 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', NOW(), NOW()),

('ks009-1111-1111-1111-111111111111', 'Indra Gunawan', 'indra@example.com', '081234567806', 'Saran: tambahkan skrining untuk penyakit lain selain diabetes.', 'saran', 0, 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', NOW(), NOW()),
('ks009-2222-2222-2222-222222222222', 'Vina Novita', 'vina@example.com', '081234567807', 'Skrining gratis sangat membantu masyarakat.', 'kritik', 2, 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', NOW(), NOW()),

('ks010-1111-1111-1111-111111111111', 'Ricky Hermansah', 'ricky@example.com', '081234567808', 'Mohon diberikan harga paket wellness yang lebih terjangkau.', 'saran', 1, 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', NOW(), NOW()),
('ks010-2222-2222-2222-222222222222', 'Wulan Ayu', 'wulan@example.com', '081234567809', 'Program yoga sangat menyenangkan, lanjutkan!', 'kritik', 2, 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', NOW(), NOW());


-- ============================================================
-- 13. STATIC PAGES (PROFIL, LAYANAN, KONTAK SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO static_pages (id, puskesmas_id, menu_id, title, static_content, createdAt, updatedAt) VALUES

-- Static Pages Bogor Tengah
('sp001-1111-1111-1111-111111111111', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'm001-1111-1111-1111-111111111111', 'Profil Puskesmas Bogor Tengah', '<h1>Profil Puskesmas Bogor Tengah</h1><p>Puskesmas Bogor Tengah merupakan fasilitas kesehatan tingkat pertama yang melayani masyarakat dengan berbagai layanan kesehatan.</p><h2>Visi</h2><p>Menjadi puskesmas terbaik dengan pelayanan kesehatan yang bermutu.</p><h2>Misi</h2><ul><li>Memberikan pelayanan kesehatan yang prima</li><li>Meningkatkan kesadaran kesehatan masyarakat</li><li>Mengembangkan SDM yang profesional</li></ul>', NOW(), NOW()),
('sp001-2222-2222-2222-222222222222', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'm001-1111-1111-1111-111111111112', 'Layanan', '<h1>Layanan Puskesmas Bogor Tengah</h1><ul><li>Pelayanan Medis Umum</li><li>Pelayanan KIA (Kesehatan Ibu dan Anak)</li><li>Pelayanan Imunisasi</li><li>Pelayanan KB</li><li>Pelayanan Laboratorium</li><li>Pelayanan Farmasi</li><li>IGD 24 Jam</li></ul>', NOW(), NOW()),
('sp001-3333-3333-3333-333333333333', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'm001-1111-1111-1111-111111111115', 'Kontak', '<h1>Kontak Kami</h1><p><strong>Alamat:</strong> Jl. Raya Bogor Tengah No. 123</p><p><strong>Telepon:</strong> (0251) 123456</p><p><strong>Email:</strong> bogortengah@puskes.id</p><p><strong>Jam Operasional:</strong> 24 Jam</p>', NOW(), NOW()),

-- Static Pages Bogor Utara
('sp002-1111-1111-1111-111111111111', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'm002-2222-2222-2222-222222222221', 'Profil', '<h1>Profil Puskesmas Bogor Utara</h1><p>Puskesmas Bogor Utara berkomitmen memberikan pelayanan kesehatan terbaik bagi masyarakat.</p><h2>Visi</h2><p>Masyarakat sehat, nusantara maju.</p>', NOW(), NOW()),
('sp002-2222-2222-2222-222222222222', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'm002-2222-2222-2222-222222222222', 'Layanan', '<h1>Layanan Kami</h1><ul><li>Poli Gigi</li><li>Poli Mata</li><li>Poli Umum</li><li>KIA</li><li>Gigi</li></ul>', NOW(), NOW()),
('sp002-3333-3333-3333-333333333333', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'm002-2222-2222-2222-222222222225', 'Kontak', '<h1>Kontak</h1><p>Jl. Bogor Utara No. 45</p><p>Telp: (0251) 234567</p>', NOW(), NOW()),

-- Static Pages Bogor Selatan
('sp003-1111-1111-1111-111111111111', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'm003-3333-3333-3333-333333333331', 'Profil', '<h1>Profil Puskesmas Bogor Selatan</h1><p>Melayani dengan hati, kesehatan untuk semua.</p>', NOW(), NOW()),
('sp003-2222-2222-2222-222222222222', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'm003-3333-3333-3333-333333333332', 'Layanan', '<h1>Layanan</h1><ul><li>Posyandu</li><li>Skrining</li><li>Imunisasi</li></ul>', NOW(), NOW()),
('sp003-3333-3333-3333-333333333333', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'm003-3333-3333-3333-333333333335', 'Kontak', '<h1>Kontak</h1><p>Jl. Bogor Selatan No. 78</p>', NOW(), NOW()),

-- Static Pages Tanah Sareal
('sp004-1111-1111-1111-111111111111', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'm004-4444-4444-4444-444444444441', 'Profil', '<h1>Profil Puskesmas Tanah Sareal</h1><p>Pelayanan prima untuk masyarakat Tanah Sareal.</p>', NOW(), NOW()),
('sp004-2222-2222-2222-222222222222', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'm004-4444-4444-4444-444444444442', 'Layanan', '<h1>Layanan</h1><ul><li>KIA</li><li>KB</li><li>Imunisasi</li></ul>', NOW(), NOW()),
('sp004-3333-3333-3333-333333333333', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'm004-4444-4444-4444-444444444445', 'Kontak', '<h1>Kontak</h1><p>Jl. Tanah Sareal No. 90</p>', NOW(), NOW()),

-- Static Pages Dramaga
('sp005-1111-1111-1111-111111111111', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'm005-5555-5555-5555-555555555551', 'Profil', '<h1>Profil Puskesmas Dramaga</h1><p>Menjaga kesehatan masyarakat Dramaga.</p>', NOW(), NOW()),
('sp005-2222-2222-2222-222222222222', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'm005-5555-5555-5555-555555555552', 'Layanan', '<h1>Layanan</h1><ul><li>Laboratorium</li><li>Apotek</li><li>IGD</li></ul>', NOW(), NOW()),
('sp005-3333-3333-3333-333333333333', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'm005-5555-5555-5555-555555555555', 'Kontak', '<h1>Kontak</h1><p>Jl. Dramaga No. 12</p>', NOW(), NOW()),

-- Static Pages Cibinong
('sp006-1111-1111-1111-111111111111', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'm006-6666-6666-6666-666666666661', 'Profil', '<h1>Profil Puskesmas Cibinong</h1><p>Fasilitas kesehatan terdepan di Cibinong.</p>', NOW(), NOW()),
('sp006-2222-2222-2222-222222222222', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'm006-6666-6666-6666-666666666662', 'Layanan', '<h1>Layanan</h1><ul><li>Klinik Gigi</li><li>Klinik Mata</li></ul>', NOW(), NOW()),
('sp006-3333-3333-3333-333333333333', 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'm006-6666-6666-6666-666666666665', 'Kontak', '<h1>Kontak</h1><p>Jl. Cibinong No. 34</p>', NOW(), NOW()),

-- Static Pages Citeureup
('sp007-1111-1111-1111-111111111111', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'm007-7777-7777-7777-777777777771', 'Profil', '<h1>Profil Puskesmas Citeureup</h1><p>Mencegah lebih baik daripada mengobati.</p>', NOW(), NOW()),
('sp007-2222-2222-2222-222222222222', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'm007-7777-7777-7777-777777777772', 'Layanan', '<h1>Layanan</h1><ul><li>Pencegahan Penyakit</li><li>Vaksinasi</li></ul>', NOW(), NOW()),
('sp007-3333-3333-3333-333333333333', 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'm007-7777-7777-7777-777777777775', 'Kontak', '<h1>Kontak</h1><p>Jl. Citeureup No. 56</p>', NOW(), NOW()),

-- Static Pages Sukaraja
('sp008-1111-1111-1111-111111111111', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'm008-8888-8888-8888-888888888881', 'Profil', '<h1>Profil Puskesmas Sukaraja</h1><p>Kesehatan masyarakat adalah prioritas.</p>', NOW(), NOW()),
('sp008-2222-2222-2222-222222222222', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'm008-8888-8888-8888-888888888882', 'Layanan', '<h1>Layanan</h1><ul><li>Klinik Gizi</li><li>Fisioterapi</li></ul>', NOW(), NOW()),
('sp008-3333-3333-3333-333333333333', 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'm008-8888-8888-8888-888888888885', 'Kontak', '<h1>Kontak</h1><p>Jl. Sukaraja No. 78</p>', NOW(), NOW()),

-- Static Pages Gunung Putri
('sp009-1111-1111-1111-111111111111', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'm009-9999-9999-9999-999999999991', 'Profil', '<h1>Profil Puskesmas Gunung Putri</h1><p>Melayani masyarakat dengan profesional.</p>', NOW(), NOW()),
('sp009-2222-2222-2222-222222222222', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'm009-9999-9999-9999-999999999992', 'Layanan', '<h1>Layanan</h1><ul><li>Skrining Kesehatan</li><li>P3K Komunitas</li></ul>', NOW(), NOW()),
('sp009-3333-3333-3333-333333333333', 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'm009-9999-9999-9999-999999999995', 'Kontak', '<h1>Kontak</h1><p>Jl. Gunung Putri No. 90</p>', NOW(), NOW()),

-- Static Pages Sentul
('sp010-1111-1111-1111-111111111111', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'm010-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Profil', '<h1>Profil Puskesmas Sentul</h1><p>Wellness untuk kehidupan yang lebih baik.</p>', NOW(), NOW()),
('sp010-2222-2222-2222-222222222222', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'm010-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Layanan', '<h1>Layanan</h1><ul><li>Wellness Center</li><li>Yoga dan Meditasi</li><li>Pengobatan Herbal</li></ul>', NOW(), NOW()),
('sp010-3333-3333-3333-333333333333', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'm010-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Kontak', '<h1>Kontak</h1><p>Jl. Sentul No. 11</p>', NOW(), NOW());


-- ============================================================
-- 14. PUSKESMAS INFO (SETIAP PUSKESMAS)
-- ============================================================

INSERT INTO web_info (puskesmas_id, web_title, logo, location, social_links, lantitude, longtitude, email, contact, kepala_puskesmas, kepala_foto, Sambutan_konten, created_at, updated_at) VALUES

('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Puskesmas Bogor Tengah', 'https://placehold.co/200x200/2E7D32/FFFFFF?text=Logo+Puskes', 'Jl. Raya Bogor Tengah No. 123, Bogor Tengah, Kota Bogor', '{"facebook":"facebook.com/pkmbogortengah","instagram":"instagram.com/pkmbogortengah","youtube":"youtube.com/pkmbogortengah"}', -6.595038, 106.816635, 'bogortengah@puskes.id', '(0251) 123456', 'Dr. H. Ahmad Susanto, M.Kes', 'https://placehold.co/200x200/2E7D32/FFFFFF?text=Kepala+Puskes', '<p>Assalamualaikum Wr. Wb.</p><p>Selamat datang di Puskesmas Bogor Tengah. Kami berkomitmen memberikan pelayanan kesehatan terbaik bagi masyarakat.</p><p>Mari bersama membangun masyarakat yang sehat!</p>', NOW(), NOW()),

('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Puskesmas Bogor Utara', 'https://placehold.co/200x200/1565C0/FFFFFF?text=Logo+Puskes', 'Jl. Bogor Utara No. 45, Bogor Utara, Kota Bogor', '{"facebook":"facebook.com/pkmbogorutara","instagram":"instagram.com/pkmbogorutara"}', -6.575000, 106.800000, 'bogorutara@puskes.id', '(0251) 234567', 'Dr. Budi Santoso, M.Psi', 'https://placehold.co/200x200/1565C0/FFFFFF?text=Kepala+Puskes', '<p>Selamat datang di Puskesmas Bogor Utara. Kesehatan Anda adalah prioritas kami.</p>', NOW(), NOW()),

('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Puskesmas Bogor Selatan', 'https://placehold.co/200x200/00838F/FFFFFF?text=Logo+Puskes', 'Jl. Bogor Selatan No. 78, Bogor Selatan, Kota Bogor', '{"instagram":"instagram.com/pkmbogorselatan","youtube":"youtube.com/pkmbogorselatan"}', -6.620000, 106.810000, 'bogorselatan@puskes.id', '(0251) 345678', 'Dr. Siti Rahayu, M.Kes', 'https://placehold.co/200x200/00838F/FFFFFF?text=Kepala+Puskes', '<p>Kami siap melayani Anda dengan penuh dedikasi.</p>', NOW(), NOW()),

('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Puskesmas Tanah Sareal', 'https://placehold.co/200x200/AD1457/FFFFFF?text=Logo+Puskes', 'Jl. Tanah Sareal No. 90, Tanah Sareal, Kota Bogor', '{"facebook":"facebook.com/pkmts"}', -6.630000, 106.820000, 'tanahsareal@puskes.id', '(0251) 456789', 'Dr. Rina Marlina', 'https://placehold.co/200x200/AD1457/FFFFFF?text=Kepala+Puskes', '<p>Melayani dengan hati adalah motto kami.</p>', NOW(), NOW()),

('f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Puskesmas Dramaga', 'https://placehold.co/200x200/0277BD/FFFFFF?text=Logo+Puskes', 'Jl. Dramaga No. 12, Dramaga, Bogor', '{"instagram":"instagram.com/pkmdramaga"}', -6.550000, 106.750000, 'dramaga@puskes.id', '(0251) 567890', 'Dr. Hendra Wijaya, Sp.PD', 'https://placehold.co/200x200/0277BD/FFFFFF?text=Kepala+Puskes', '<p>Kesehatan Anda adalah tanggung jawab kami.</p>', NOW(), NOW()),

('a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Puskesmas Cibinong', 'https://placehold.co/200x200/E65100/FFFFFF?text=Logo+Puskes', 'Jl. Cibinong No. 34, Cibinong, Bogor', '{"facebook":"facebook.com/pkmcibinong","youtube":"youtube.com/pkmcibinong"}', -6.480000, 106.850000, 'cibinong@puskes.id', '(0251) 678901', 'Dr. Maya Sari, M.Kes', 'https://placehold.co/200x200/E65100/FFFFFF?text=Kepala+Puskes', '<p>Pelayanan prima adalah tujuan kami.</p>', NOW(), NOW()),

('b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'Puskesmas Citeureup', 'https://placehold.co/200x200/4527A0/FFFFFF?text=Logo+Puskes', 'Jl. Citeureup No. 56, Citeureup, Bogor', '{"instagram":"instagram.com/pkmciteureup"}', -6.520000, 106.870000, 'citeureup@puskes.id', '(0251) 789012', 'Dr. Fajar Nugroho', 'https://placehold.co/200x200/4527A0/FFFFFF?text=Kepala+Puskes', '<p>Mencegah penyakit adalah fokus kami.</p>', NOW(), NOW()),

('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Puskesmas Sukaraja', 'https://placehold.co/200x200/283593/FFFFFF?text=Logo+Puskes', 'Jl. Sukaraja No. 78, Sukaraja, Bogor', '{"facebook":"facebook.com/pkmsukaraja"}', -6.560000, 106.880000, 'sukaraja@puskes.id', '(0251) 890123', 'Dr. Dian Pratama', 'https://placehold.co/200x200/283593/FFFFFF?text=Kepala+Puskes', '<p>Kesehatan keluarga adalah investasi masa depan.</p>', NOW(), NOW()),

('d0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a', 'Puskesmas Gunung Putri', 'https://placehold.co/200x200/D84315/FFFFFF?text=Logo+Puskes', 'Jl. Gunung Putri No. 90, Gunung Putri, Bogor', '{"instagram":"instagram.com/pkmgunungputri","youtube":"youtube.com/pkmgunungputri"}', -6.440000, 106.900000, 'gunungputri@puskes.id', '(0251) 901234', 'Dr. Reza Maulana', 'https://placehold.co/200x200/D84315/FFFFFF?text=Kepala+Puskes', '<p>Deteksi dini untuk hidup yang lebih baik.</p>', NOW(), NOW()),

('e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Puskesmas Sentul', 'https://placehold.co/200x200/00897B/FFFFFF?text=Logo+Puskes', 'Jl. Sentul No. 11, Sentul, Bogor', '{"facebook":"facebook.com/pkmsentul","instagram":"instagram.com/pkmsentul"}', -6.510000, 106.910000, 'sentul@puskes.id', '(0251) 012345', 'Dr. Wulan Ayu, M.Gizi', 'https://placehold.co/200x200/00897B/FFFFFF?text=Kepala+Puskes', '<p>Wellness adalah kunci kehidupan yang bahagia.</p>', NOW(), NOW());


-- ============================================================
-- RESET FOREIGN KEYS
-- ============================================================

SET FOREIGN_KEY_CHECKS = 1;
