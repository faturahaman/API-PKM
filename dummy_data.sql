
-- Insert Dummy Puskesmas
INSERT INTO puskesmas (id, name, slug, alamat, primary_color, status, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'Puskesmas Bogor Tengah', 'pkm-bogor-tengah', 'Jl. Bogor Raya No. 12', '#3b82f6', 'ACTIVE', NOW(), NOW());

-- Insert Dummy Menus
INSERT INTO menus (id, puskesmas_id, title, slug, type, status, `order`, parent_id, createdAt, updatedAt)
VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Beranda', 'beranda', 'static', 1, 1, NULL, NOW(), NOW()),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Profil', 'profil', 'static', 1, 2, NULL, NOW(), NOW()),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Pelayanan', 'pelayanan', 'static', 1, 3, NULL, NOW(), NOW());

-- Insert Dummy Banner
INSERT INTO banners (id, puskesmas_id, image_path, title, description, is_publish, is_deleted, created_at, updated_at)
VALUES ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'https://placehold.co/1920x1080/4f46e5/ffffff?text=Selamat+Datang+di+Puskesmas', 'Selamat Datang', 'Melayani dengan hati untuk kesehatan masyarakat.', 1, 0, NOW(), NOW());
