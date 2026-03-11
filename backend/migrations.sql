-- Migration dasar RS Pelita CMS
-- Jalankan file ini pada database MySQL yang dikonfigurasi di .env (DB_NAME)

CREATE TABLE IF NOT EXISTS content_blocks (
  slug VARCHAR(50) NOT NULL,
  title VARCHAR(255) NULL,
  body TEXT NULL,
  extra_json JSON NULL,
  PRIMARY KEY (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS facilities (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS doctors (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NULL,
  schedule VARCHAR(255) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS articles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NULL,
  body TEXT NULL,
  image_path VARCHAR(255) NULL,
  published_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

