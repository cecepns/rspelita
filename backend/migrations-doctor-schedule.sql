-- Jadwal dokter per hari + foto dokter
-- Wajib dijalankan sekali setelah migrations.sql agar fitur jadwal Senin–Sabtu dan foto dokter berfungsi.
-- Contoh: mysql -u root -p rs_pelita_cms < migrations-doctor-schedule.sql

ALTER TABLE doctors ADD COLUMN image_path VARCHAR(255) NULL AFTER specialty;
ALTER TABLE doctors ADD COLUMN schedule_senin VARCHAR(100) NULL;
ALTER TABLE doctors ADD COLUMN schedule_selasa VARCHAR(100) NULL;
ALTER TABLE doctors ADD COLUMN schedule_rabu VARCHAR(100) NULL;
ALTER TABLE doctors ADD COLUMN schedule_kamis VARCHAR(100) NULL;
ALTER TABLE doctors ADD COLUMN schedule_jumat VARCHAR(100) NULL;
ALTER TABLE doctors ADD COLUMN schedule_sabtu VARCHAR(100) NULL;
