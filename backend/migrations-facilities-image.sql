-- Gambar fasilitas layanan
-- Wajib dijalankan sekali setelah migrations.sql agar fitur upload gambar fasilitas berfungsi.
-- Contoh: mysql -u root -p rs_pelita_cms < migrations-facilities-image.sql

ALTER TABLE facilities ADD COLUMN image_path VARCHAR(255) NULL AFTER description;
