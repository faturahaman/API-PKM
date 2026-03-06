
-- 1. Create Puskesmas
INSERT INTO puskesmas (id, name, slug, alamat, primary_color, status, created_at, updated_at)
VALUES ('3c2825f7-a5c1-4026-8267-50febc741f79', 'Puskesmas Default', 'default', 'Alamat Puskesmas Default', '#10b981', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- 2. Create Admins (Password: admin123)
-- Super Admin
INSERT INTO admins (id, name, role, password, puskesmas_id, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000001', 'superadmin', 'SUPER_ADMIN', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE role=role;

-- Operator for Default PKM
INSERT INTO admins (id, name, role, password, puskesmas_id, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000002', 'operator', 'OPERATOR', '$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K', '3c2825f7-a5c1-4026-8267-50febc741f79', NOW(), NOW())
ON DUPLICATE KEY UPDATE role=role;

-- 3. Create Menus
INSERT INTO menus (id, puskesmas_id, title, slug, type, status, `order`, parent_id, createdAt, updatedAt)
VALUES 
('10000000-0000-0000-0000-000000000001', '3c2825f7-a5c1-4026-8267-50febc741f79', 'Beranda', 'beranda', 'static', 1, 1, NULL, NOW(), NOW()),
('10000000-0000-0000-0000-000000000002', '3c2825f7-a5c1-4026-8267-50febc741f79', 'Profil', 'profil', 'static', 1, 2, NULL, NOW(), NOW()),
('10000000-0000-0000-0000-000000000003', '3c2825f7-a5c1-4026-8267-50febc741f79', 'Layanan', 'layanan', 'static', 1, 3, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;

-- 4. Create Banners
INSERT INTO banners (id, puskesmas_id, image_path, title, description, is_publish, is_deleted, created_at, updated_at)
VALUES 
('20000000-0000-0000-0000-000000000001', '3c2825f7-a5c1-4026-8267-50febc741f79', 'https://placehold.co/1920x1080/059669/ffffff?text=Banner+Puskesmas+1', 'Selamat Datang', 'Puskesmas modern untuk masyarakat.', 1, 0, NOW(), NOW()),
('20000000-0000-0000-0000-000000000002', '3c2825f7-a5c1-4026-8267-50febc741f79', 'https://placehold.co/1920x1080/0d9488/ffffff?text=Banner+Puskesmas+2', 'Pelayanan 24 Jam', 'Kami siap melayani Anda kapan saja.', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE title=title;
