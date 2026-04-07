CREATE DATABASE IF NOT EXISTS rbpl_rs;
USE rbpl_rs;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('pasien', 'dokter', 'apoteker', 'lab', 'bpjs', 'manajemen') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `pasien` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `nik` VARCHAR(16) NOT NULL,
  `no_bpjs` VARCHAR(20),
  `dokumen_ktp` VARCHAR(255),
  `dokumen_bpjs` VARCHAR(255),
  `alamat` TEXT,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `antrean` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pasien_id` INT NOT NULL,
  `tanggal` DATE NOT NULL,
  `no_antrean` INT NOT NULL,
  `status` ENUM('menunggu', 'diperiksa', 'selesai') DEFAULT 'menunggu',
  FOREIGN KEY (`pasien_id`) REFERENCES `pasien`(`id`) ON DELETE CASCADE
);

CREATE TABLE `rekam_medis` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `antrean_id` INT NOT NULL,
  `keluhan` TEXT NOT NULL,
  `diagnosa` TEXT,
  `resep_id` INT NULL,  -- Will link later, or just use resep table pointing here
  `lab_id` INT NULL, 
  FOREIGN KEY (`antrean_id`) REFERENCES `antrean`(`id`) ON DELETE CASCADE
);

CREATE TABLE `lab` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `rekam_medis_id` INT NOT NULL,
  `jenis_tes` VARCHAR(100) NOT NULL,
  `hasil_lab` TEXT,
  `status` ENUM('menunggu', 'selesai') DEFAULT 'menunggu',
  FOREIGN KEY (`rekam_medis_id`) REFERENCES `rekam_medis`(`id`) ON DELETE CASCADE
);

CREATE TABLE `resep` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `rekam_medis_id` INT NOT NULL,
  `rincian_obat` TEXT NOT NULL,
  `status` ENUM('menunggu', 'diambil') DEFAULT 'menunggu',
  FOREIGN KEY (`rekam_medis_id`) REFERENCES `rekam_medis`(`id`) ON DELETE CASCADE
);

CREATE TABLE `tagihan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `antrean_id` INT NOT NULL,
  `total_biaya` DECIMAL(15,2) NOT NULL,
  `status` ENUM('belum_dibayar', 'lunas') DEFAULT 'belum_dibayar',
  FOREIGN KEY (`antrean_id`) REFERENCES `antrean`(`id`) ON DELETE CASCADE
);

CREATE TABLE `klaim_bpjs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tagihan_id` INT NOT NULL,
  `status` ENUM('menunggu', 'disetujui', 'ditolak') DEFAULT 'menunggu',
  FOREIGN KEY (`tagihan_id`) REFERENCES `tagihan`(`id`) ON DELETE CASCADE
);

-- Insert Dummy Users
INSERT INTO `users` (`username`, `password`, `role`) VALUES
('admin_med', 'password123', 'manajemen'),
('dr_budi', 'password123', 'dokter'),
('apoteker_siti', 'password123', 'apoteker'),
('lab_agung', 'password123', 'lab'),
('bpjs_admin', 'password123', 'bpjs');
