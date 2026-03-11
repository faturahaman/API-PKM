-- ============================================================
-- PASSWORD SEMUA ADMIN
-- admin123
-- ============================================================

-- ============================================================
-- SUPER ADMIN
-- ============================================================

INSERT INTO admins (id,name,role,password,puskesmas_id,created_at,updated_at) VALUES
('99999999-9999-9999-9999-999999999999',
'superadmin',
'SUPER_ADMIN',
'$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K',
NULL,
NOW(),
NOW());



-- ============================================================
-- PUSKESMAS
-- ============================================================

INSERT INTO puskesmas (id,name,slug,status,created_at,updated_at) VALUES

('11111111-1111-1111-1111-111111111111','Puskesmas Bogor Tengah','pkm-bogor-tengah','ACTIVE',NOW(),NOW()),
('22222222-2222-2222-2222-222222222222','Puskesmas Bogor Utara','pkm-bogor-utara','ACTIVE',NOW(),NOW()),
('33333333-3333-3333-3333-333333333333','Puskesmas Bogor Selatan','pkm-bogor-selatan','ACTIVE',NOW(),NOW()),
('44444444-4444-4444-4444-444444444444','Puskesmas Tanah Sareal','pkm-tanah-sareal','ACTIVE',NOW(),NOW()),
('55555555-5555-5555-5555-555555555555','Puskesmas Dramaga','pkm-dramaga','ACTIVE',NOW(),NOW()),
('66666666-6666-6666-6666-666666666666','Puskesmas Cibinong','pkm-cibinong','ACTIVE',NOW(),NOW()),
('77777777-7777-7777-7777-777777777777','Puskesmas Citeureup','pkm-citeureup','ACTIVE',NOW(),NOW()),
('88888888-8888-8888-8888-888888888888','Puskesmas Sukaraja','pkm-sukaraja','ACTIVE',NOW(),NOW()),
('99999999-8888-7777-6666-555555555555','Puskesmas Gunung Putri','pkm-gunung-putri','ACTIVE',NOW(),NOW()),
('aaaaaaaa-1111-2222-3333-444444444444','Puskesmas Sentul','pkm-sentul','ACTIVE',NOW(),NOW());



-- ============================================================
-- OPERATOR
-- ============================================================

INSERT INTO admins (id,name,role,password,puskesmas_id,created_at,updated_at) VALUES

('op111111-1111-1111-1111-111111111111',
'operatortengah',
'OPERATOR',
'$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K',
'11111111-1111-1111-1111-111111111111',
NOW(),NOW()),

('op222222-2222-2222-2222-222222222222',
'operatorutara',
'OPERATOR',
'$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K',
'22222222-2222-2222-2222-222222222222',
NOW(),NOW()),

('op333333-3333-3333-3333-333333333333',
'operatorselatan',
'OPERATOR',
'$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K',
'33333333-3333-3333-3333-333333333333',
NOW(),NOW()),

('op444444-4444-4444-4444-444444444444',
'operatorsareal',
'OPERATOR',
'$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K',
'44444444-4444-4444-4444-444444444444',
NOW(),NOW()),

('op555555-5555-5555-5555-555555555555',
'operatordramaga',
'OPERATOR',
'$2b$10$9od9vp5hqKV9xg8AUZJGnetSIphpsdMq9E1UpztiTCPgMAR9EPd/K',
'55555555-5555-5555-5555-555555555555',
NOW(),NOW());



-- ============================================================
-- MENUS
-- (TANPA BERANDA GALERI AGENDA)
-- ============================================================

INSERT INTO menus (id,puskesmas_id,title,slug,type,status,`order`,parent_id,createdAt,updatedAt) VALUES

('m1111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','Profil','profil','static',1,1,NULL,NOW(),NOW()),
('m1111111-1111-1111-1111-111111111112','11111111-1111-1111-1111-111111111111','Layanan','layanan','static',1,2,NULL,NOW(),NOW()),
('m1111111-1111-1111-1111-111111111113','11111111-1111-1111-1111-111111111111','Berita','berita','dynamic',1,3,NULL,NOW(),NOW()),
('m1111111-1111-1111-1111-111111111114','11111111-1111-1111-1111-111111111111','Pengumuman','pengumuman','dynamic',1,4,NULL,NOW(),NOW()),
('m1111111-1111-1111-1111-111111111115','11111111-1111-1111-1111-111111111111','Kontak','kontak','static',1,5,NULL,NOW(),NOW());



-- ============================================================
-- BANNERS
-- ============================================================

INSERT INTO banners (id,puskesmas_id,image_path,title,description,is_publish,is_deleted,created_at,updated_at) VALUES

('b1111111-1111-1111-1111-111111111111',
'11111111-1111-1111-1111-111111111111',
'https://placehold.co/1920x600?text=Puskesmas+Bogor+Tengah',
'Selamat Datang',
'Pelayanan kesehatan terbaik',
1,0,NOW(),NOW()),

('b2222222-2222-2222-2222-222222222222',
'22222222-2222-2222-2222-222222222222',
'https://placehold.co/1920x600?text=Puskesmas+Bogor+Utara',
'Pelayanan Ramah',
'Kami siap melayani masyarakat',
1,0,NOW(),NOW()),

('b3333333-3333-3333-3333-333333333333',
'33333333-3333-3333-3333-333333333333',
'https://placehold.co/1920x600?text=Puskesmas+Bogor+Selatan',
'Kesehatan Keluarga',
'Menuju masyarakat sehat',
1,0,NOW(),NOW());



-- ============================================================
-- BERITA
-- ============================================================

INSERT INTO pages (id,puskesmas_id,menu_id,title,dynamic_content,type,status,createdAt,updatedAt) VALUES

('p1111111-1111-1111-1111-111111111111',
'11111111-1111-1111-1111-111111111111',
'm1111111-1111-1111-1111-111111111113',
'Vaksinasi Gratis',
'<p>Kegiatan vaksinasi untuk masyarakat.</p>',
'halaman',1,NOW(),NOW()),

('p2222222-2222-2222-2222-222222222222',
'11111111-1111-1111-1111-111111111111',
'm1111111-1111-1111-1111-111111111113',
'Cek Kesehatan Gratis',
'<p>Pemeriksaan kesehatan gratis.</p>',
'halaman',1,NOW(),NOW()),

('p3333333-3333-3333-3333-333333333333',
'22222222-2222-2222-2222-222222222222',
'm1111111-1111-1111-1111-111111111113',
'Program Imunisasi Anak',
'<p>Kegiatan imunisasi untuk balita.</p>',
'halaman',1,NOW(),NOW());



-- ============================================================
-- REVIEWS
-- ============================================================

INSERT INTO reviews (id,puskesmas_id,username,message,category,is_publish,created_at,updated_at) VALUES

('r1111111-1111-1111-1111-111111111111',
'11111111-1111-1111-1111-111111111111',
'Budi',
'Pelayanan sangat baik',
'Pelayanan',
1,NOW(),NOW()),

('r2222222-2222-2222-2222-222222222222',
'22222222-2222-2222-2222-222222222222',
'Siti',
'Dokter sangat ramah',
'Tenaga Medis',
1,NOW(),NOW());



-- ============================================================
-- CONSULTATIONS
-- ============================================================

INSERT INTO consultations (puskesmas_id,username,email,subject,message,is_answer,is_publish,created_at,updated_at) VALUES

('11111111-1111-1111-1111-111111111111',
'Dewi',
'dewi@email.com',
'Jadwal vaksin',
'Kapan vaksin tersedia?',
0,1,NOW(),NOW()),

('22222222-2222-2222-2222-222222222222',
'Rudi',
'rudi@email.com',
'Cek kesehatan',
'Apakah bisa cek tekanan darah?',
0,1,NOW(),NOW());