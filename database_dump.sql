-- Database Dump untuk family_tree_nasrukhan
-- Tanggal: 2026-08-04 03:46:46
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `log_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) unsigned DEFAULT NULL,
  `causer_type` varchar(255) DEFAULT NULL,
  `causer_id` bigint(20) unsigned DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `batch_uuid` uuid DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subject` (`subject_type`,`subject_id`),
  KEY `causer` (`causer_type`,`causer_id`),
  KEY `activity_log_log_name_index` (`log_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('dinasti-nasrukhan-cache-356a192b7913b04c54574d18c28d46e6395428ab', 'i:1;', '1785809542'),
('dinasti-nasrukhan-cache-356a192b7913b04c54574d18c28d46e6395428ab:timer', 'i:1785809542;', '1785809542'),
('dinasti-nasrukhan-cache-dc44958e29ffba8b810d21377ae366b5', 'i:1;', '1785809424'),
('dinasti-nasrukhan-cache-dc44958e29ffba8b810d21377ae366b5:timer', 'i:1785809424;', '1785809424');

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `family_members`;
CREATE TABLE `family_members` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `birth_date` date DEFAULT NULL,
  `death_date` date DEFAULT NULL,
  `birth_place` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `parent_spouse_id` bigint(20) unsigned DEFAULT NULL,
  `generation` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `family_members_parent_id_index` (`parent_id`),
  KEY `family_members_generation_index` (`generation`),
  KEY `family_members_parent_spouse_id_foreign` (`parent_spouse_id`),
  CONSTRAINT `family_members_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `family_members` (`id`) ON DELETE SET NULL,
  CONSTRAINT `family_members_parent_spouse_id_foreign` FOREIGN KEY (`parent_spouse_id`) REFERENCES `spouses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `family_members` (`id`, `name`, `gender`, `birth_date`, `death_date`, `birth_place`, `bio`, `photo`, `parent_id`, `parent_spouse_id`, `generation`, `created_at`, `updated_at`) VALUES
('1', 'Eko Tjahjo Purnomo', 'male', NULL, NULL, 'Malang', NULL, NULL, '10', '6', '2', '2026-08-04 02:15:59', '2026-08-04 02:31:38'),
('2', 'Emmy Sulistyo Purnomo', 'female', '1977-03-03', NULL, 'Mojokerto', NULL, 'family-photos/s544oOXs5ZK7dnziDp3pDGfplV85kUpa3yzkVB4Z.jpg', '1', '1', '3', '2026-08-04 02:17:36', '2026-08-04 02:31:38'),
('3', 'Tony', 'male', NULL, NULL, NULL, NULL, NULL, '1', '1', '3', '2026-08-04 02:18:18', '2026-08-04 02:31:38'),
('4', 'Muhammad Fikri Fadli Assidqy', 'male', '2004-01-21', NULL, 'Mojokerto', NULL, 'family-photos/eG40uiRGtYf1ma92822hApF5P7eLx47p2KzSDh5G.jpg', '2', '2', '4', '2026-08-04 02:18:53', '2026-08-04 02:31:38'),
('5', 'Febrianto Tri Purnomo', 'male', NULL, NULL, 'Mojokerto', NULL, NULL, '1', '1', '3', '2026-08-04 02:20:10', '2026-08-04 02:44:36'),
('6', 'Vito', 'male', NULL, NULL, 'Mojokerto', NULL, NULL, '3', '3', '4', '2026-08-04 02:20:25', '2026-08-04 02:31:38'),
('7', 'Rangga', 'male', NULL, NULL, NULL, NULL, NULL, '3', '3', '4', '2026-08-04 02:20:43', '2026-08-04 02:31:38'),
('8', 'Nashwa', 'female', NULL, NULL, NULL, NULL, NULL, '3', '3', '4', '2026-08-04 02:28:38', '2026-08-04 02:31:38'),
('9', 'Haidar', 'male', NULL, NULL, NULL, NULL, NULL, '5', '5', '4', '2026-08-04 02:29:01', '2026-08-04 02:31:38'),
('10', 'Nikayah', 'female', NULL, NULL, 'Batu', NULL, NULL, NULL, NULL, '1', '2026-08-04 02:31:18', '2026-08-04 02:31:18'),
('11', 'Dwi Endang Purnomowati', 'female', NULL, NULL, 'Batu', NULL, NULL, '10', '6', '2', '2026-08-04 02:33:25', '2026-08-04 02:33:25'),
('12', 'Wahyu Sumarsono', 'male', NULL, NULL, 'Batu', NULL, NULL, '11', '8', '3', '2026-08-04 02:33:53', '2026-08-04 02:33:53'),
('13', 'Tri Andayani', 'female', NULL, NULL, 'Batu', NULL, NULL, '10', '6', '2', '2026-08-04 02:34:24', '2026-08-04 02:38:28'),
('14', 'Santi Yunita Anggraeni', 'male', NULL, NULL, 'Batu', NULL, NULL, '13', '11', '3', '2026-08-04 02:35:06', '2026-08-04 02:35:06'),
('15', 'Sinta Triwulan', 'female', NULL, NULL, 'Batu', NULL, NULL, '13', '11', '3', '2026-08-04 02:35:49', '2026-08-04 02:38:40'),
('16', 'Dhimasadji Suryowibowo', 'male', NULL, NULL, 'Batu', NULL, NULL, '14', '12', '4', '2026-08-04 02:36:17', '2026-08-04 02:45:02'),
('17', 'Krisna Aji Bayu Nugroho', 'male', NULL, NULL, 'Batu', NULL, NULL, '14', '12', '4', '2026-08-04 02:36:45', '2026-08-04 02:45:22'),
('18', 'Lies Purnomowati', 'female', NULL, NULL, 'Batu', NULL, NULL, '10', '6', '2', '2026-08-04 02:37:57', '2026-08-04 02:37:57'),
('19', 'Dario', 'male', NULL, NULL, 'Belanda', NULL, NULL, '15', '13', '4', '2026-08-04 02:46:21', '2026-08-04 02:46:21'),
('20', 'Thalia', 'female', NULL, NULL, 'Belanda', NULL, NULL, '15', '13', '4', '2026-08-04 02:46:41', '2026-08-04 02:46:41');

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
('1', '0001_01_01_000000_create_users_table', '1'),
('2', '0001_01_01_000001_create_cache_table', '1'),
('3', '0001_01_01_000002_create_jobs_table', '1'),
('4', '2025_08_14_170933_add_two_factor_columns_to_users_table', '1'),
('5', '2026_03_24_200000_create_family_members_table', '1'),
('6', '2026_03_24_200001_create_spouses_table', '1'),
('7', '2026_03_24_200002_update_family_members_for_spouses', '1'),
('8', '2026_03_25_000221_add_photo_to_spouses_table', '1'),
('9', '2026_03_25_063135_create_activity_log_table', '1'),
('10', '2026_03_25_063136_add_event_column_to_activity_log_table', '1'),
('11', '2026_03_25_063137_add_batch_uuid_column_to_activity_log_table', '1'),
('12', '2026_04_04_000001_add_role_and_status_to_users_table', '1'),
('13', '2026_04_04_000002_create_user_branch_assignments_table', '1'),
('14', '2026_03_25_000222_add_status_to_spouses_table', '2');

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('3KymgkSJk3GetXwyKkZJjFq6ofiA83AQq5I0oviT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Herd/1.26.0 Chrome/120.0.6099.291 Electron/28.2.5 Safari/537.36', 'ZXlKcGRpSTZJbXg2T1hwTGFWWkhWbm92TldwaksxcGlhRGtyTWxFOVBTSXNJblpoYkhWbElqb2lPVmxET1VSUGFXZGphMmROYVZka2RGQkVkVzB3VVhrMVRqWktZVTR2YVVKQlVYWjBjakppYlZVMFQxUlhaMEZWUkRCQ1JFRnZObWs0UmlzdlRVTjVhbXMyVlVabFZGazJRbXhQYjFSSU0yNW9ZMlZaTkUxalZHRlJOWE5VYUd4SFVYSkxVbVJNVlV0U2FuazNibnBHTTI1dVJrTjVlVWtyYkcxclFuY3ZMMDV4WW5ZclpIUTBOa1V5Y1V0cFNUZ3phV3cwUjI5WU9IVktkRnBGVDBOcmJsUnFkbVJ3Y0VsbmRFSnJVVXRhYUVzd1kyRjFaM2xrU0VweVRXTXhiWGR1TUc5S1FqTlhOVUY0Ymk4Mk4yUXlhSEkzVTA1NlNsbGxLeTlXVkVSTGQzaFNlRUpGZVVadksxWldMMnhGU0VSemVrMWlSRXBMYVhjdlpUUXJjbFUzWlNJc0ltMWhZeUk2SW1NMllXSmpNMlExWm1FM1l6azVaamN5TVRrMU56QTRPV1F5T0RnelpURXdPV05qTWpSbU9ETTJOREkyTkRCa1pXUXdOREJtTldKak1qTTJNemt5T1RNaUxDSjBZV2NpT2lJaWZRPT0=', '1785814052'),
('5XNoxLIK37zQaxdPtnl9HAR4yeIAydS6IUy8977S', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'ZXlKcGRpSTZJazFrY2xrMmMyTnFNWEpJZGpSSFZHTkRTVWxrYkVFOVBTSXNJblpoYkhWbElqb2lUMHBQT0ZCS1ZsbFZSMlY1Tms5dVoyUm9WVTEwYWpoSFpVWlBjbXhwUkdwcWJuZFFlVTlTUmpaWk5FaHRXSHBVWkdKdU5rTnVjRTltUWpKQ1RFNUZTVGd5VTBwS1JFNWtZek00ZWt3NWVHTTFUVms0ZUdFNFluVkJUekJTVkZGalQyOUhka1IwYW5veGVtZDZLMmsxZWtSRmJtazFSbTlqZDNad09GSk5TbThpTENKdFlXTWlPaUk0WkdObE5UWTJaalZtTlRCaE56TTBOV1V6TUdKaU5HUTBZMlpoWmpSaU5qaGpabVl4T0dSaE9EUTVNems0T0RBd1ltWXpORGxsT0RRMU5HVTBZakprSWl3aWRHRm5Jam9pSW4wPQ==', '1785809043'),
('A1iwdDHY4eMrHYYAKaQSvc2i4SieyfbH4ld2wG2s', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'ZXlKcGRpSTZJblZDY2tOSFdVRlJTSEo0TVhkMFpqSlRkM0pSTlVFOVBTSXNJblpoYkhWbElqb2lWWFJWYkVWSU0ySkhlR2hvVlZONU5TdFpPWE42Wm5kTFdFc3piazlRTjFSUVRIZDJjWE5EVTJGQ2RqZ3ZVbmh3WVdrMmFrOTFVMkYwTjJOdlJIcGFNMnRKY1U5TVpXRnZTbFJuY1U4NVdIYzFRVEpoVTBKbFVHVnROa3N5TkUxSFVqZzJjRTlOVEhsS2VIQm9ORkJIVkZWaU4xQmxNVzB5Ums1blkycEdhMm9pTENKdFlXTWlPaUpoT1RVMVpqUmhZVGMxTURRMk1UUTJZMkl4WWpVNVkyWmpZMk5qT0RWa00yRXpPVGhpWlRBMU5qUTROekprT1dRek1qVmhNbUZpTnpOaU1EZGlOekkzSWl3aWRHRm5Jam9pSW4wPQ==', '1785811828'),
('eKoDQ8aXdGtZgC5cKDez6QvuXH6O1iAzRNxCgwSw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'ZXlKcGRpSTZJalpUTkdWcmJFa3dWRVZEWkZaS2VrVnlORzlLYldjOVBTSXNJblpoYkhWbElqb2ljVk5oUkc1bFoycGhja1EwVEM5R2IyOVVVWGhQZUVkR0wwbzFjR1IzVkhwQk1ERjZjako1THpFM0syOUZlbXB4ZVRsYVFtMUpUVkZRVVRkRmVYUlNkMkZsY0M4M1pVSlpNelo0VWl0MVRUSkdNVmR2VkZONVoxcHpNMDFRZDBvM05WbE1Na3RoVm5Wb1VHY3llRWx5UkZsWE9HeExSSEpYWjNCdlV6ZzFXWGtpTENKdFlXTWlPaUl5TW1ReVpXSXdaamswT1RjelpEWTRabVptWTJZM01EYzFNamMwWVdSaFlUTmhNelJrTkdWak1tTmpaRGxoTURjeE5ESmhaVE5rTldWbU0ySmxZemhrSWl3aWRHRm5Jam9pSW4wPQ==', '1785809046'),
('FfTnEJMxanO4dhPBgA2iXk53k2xjNNlEgTJ1aY9s', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'ZXlKcGRpSTZJbXBRV21WNVEwRTRPRWd3VjA4NVdIZHdlVFp6VFhjOVBTSXNJblpoYkhWbElqb2lWSG8zV204NFNFaGFVR3BKYjNKaVR5c3lNMVJGVmtKS00weFFjSGhNVEVaak1rOU5PWGRWUVdVcmRrbFFRVTVvTVVaWU9IRkhNV3hDWWtNM1p6VldTekpzVDFGRGVtc3hVMkk0Tm5wRlMwaDVka1pZV0dsNFVHTktNVUkzWmt0NWJuTlFNRWsyTUZwb1ZtdEhibEp0V0dwNldtSlBhUzgwUTJkb1RqTlRjbUVpTENKdFlXTWlPaUl6WVRaalpqRmhaalZtTVdNNU1HWTBOMlUzTm1Zd1kyWXpaVEpsTmprME5UY3hOMlJrTVRRNE9UUTRNMlJtTnpjelpUYzBPVFprTXprek1HTTFOMlZrSWl3aWRHRm5Jam9pSW4wPQ==', '1785809060'),
('fmswfOJ5qHq5SlQW2TLNZd6sBweBKB9clhsw6JOO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'ZXlKcGRpSTZJbEJ5VldKUFVDOUxVRmhaTlZKeWRTdGFTMkZFYjJjOVBTSXNJblpoYkhWbElqb2libEJ5WjA4NFZHSnJaRkl2T1VWR0wwTmxOVVptWkVvd016Sk1aV3N4VVRFNWVUTjZXVTlSVm1jeVFuVmpjV1JqU0RFeVVXTkVNRnA2WldjMVl6WXdkbnBIV1VScWRGcDRhVmxqV204MVlWSnRSRFJ3VjFnMlFsaEJRMDU2Y0M5bFZDdEdkbFpSY1M5MVlVbHNTRzFLVkV3NU56VXhlV3RrUTFCVk0zaEZaMEkwUzNsR2JHZEVORUZVVFVGVFlXZEdLMk5UTVdWTFowSmtZaXQwV2toSGEwaHJkbFZsVFRaWGVVVmpZMGhPYmtkcU1VcEpVbmNyYVV0aFdYVkVaV3R1YWxGSVQzRjNUVWxIVlZob05Wb3lLM2xoT0RoalVVWktiVFZhTldWMlozbEtWV3g2WmxWR1pETkhRVDBpTENKdFlXTWlPaUkyTWpBeVl6azRPV0ZsTUdKbE5qWTNPVEE1WWpFek1EQTNZamMwWWpnNE1qSmhNR0l4TlRWbE5XUTJaREUwWmpnNE9UZzROV0l4WmpneE9XSmpaVE01SWl3aWRHRm5Jam9pSW4wPQ==', '1785814052'),
('FWccFYfqGxmNSiJq6DZi50af81QOBk7UlGz46tMB', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'ZXlKcGRpSTZJbE5ETm5WUmRFNVZVVW80S3k5WmJraHFWRTFYVFhjOVBTSXNJblpoYkhWbElqb2ljeTk2VUZKalNtSXpla2RGYlZOcFYzVldUVmx4Vm5CQlFtZE9ORUp0U1dWbUsxVkdOek5KVVVaVVRIWkdUak52Um1Ga1VsTlhNRWR6UkVoNFNGbFdjRTlZTDBka1RHSnBRelpoWTJwRGJ6bGxTbEJwTTAxUlVVcG5hWE12YW01eVFVaExWR3hYUzNsTGRGVkpabkppYm1GelpXeFRRbHAzYjJJM1dreEJPR2h6WlhoVllVdzBRMFp2VTNrdlVuRkJja3BRVGl0UldGVXpjMnczY1ZsSlF6WmxUbEV2U210eWIwZFFSa1p6T1cxUWRFaG9ZVXQyZFRoSE1FcGlPVzQ0YTA4NWNDdFROamxZTVVJMGVWRnhPV3B0VFVoT2FHRlBPVXRhUldaSVFuVmFhWGxOT1RkMmQwb3ZPRDBpTENKdFlXTWlPaUl3T0RabE1HRmxOVEV5WmpWa1pUTTFaVEEyTnpKbVl6WXdaVGMxTjJRNU5UY3laVEJrTWpsbE16VTBZekptTUdSaVlXTXdOVGxqT0dabU1EQmxZekV6SWl3aWRHRm5Jam9pSW4wPQ==', '1785809035');

DROP TABLE IF EXISTS `spouses`;
CREATE TABLE `spouses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `family_member_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `birth_date` date DEFAULT NULL,
  `death_date` date DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'married',
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `spouses_family_member_id_foreign` (`family_member_id`),
  CONSTRAINT `spouses_family_member_id_foreign` FOREIGN KEY (`family_member_id`) REFERENCES `family_members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `spouses` (`id`, `family_member_id`, `name`, `gender`, `birth_date`, `death_date`, `status`, `photo`, `created_at`, `updated_at`) VALUES
('1', '1', 'Umi Salucha', 'female', NULL, NULL, 'married', NULL, '2026-08-04 02:15:59', '2026-08-04 02:15:59'),
('2', '2', 'Kurniawan', 'male', '1974-07-19', NULL, 'married', 'family-photos/LpGNmKgoFABfDOhkWIfcEqDwH1uZS0LQFB8SfpTu.jpg', '2026-08-04 02:17:36', '2026-08-04 02:17:36'),
('3', '3', 'Ivo', 'female', NULL, NULL, 'divorced', NULL, '2026-08-04 02:18:18', '2026-08-04 02:43:33'),
('4', '3', 'Jujuk', 'female', NULL, NULL, 'married', NULL, '2026-08-04 02:19:24', '2026-08-04 02:19:24'),
('5', '5', 'Indah Mufida', 'female', NULL, NULL, 'married', NULL, '2026-08-04 02:20:10', '2026-08-04 02:20:10'),
('6', '10', 'Hari Purnomo', 'male', NULL, NULL, 'married', NULL, '2026-08-04 02:31:18', '2026-08-04 02:31:18'),
('8', '11', 'Sumarsono', 'male', NULL, NULL, 'divorced', NULL, '2026-08-04 02:33:25', '2026-08-04 02:45:50'),
('11', '13', 'Bambang Gardoputro (Hengki)', 'male', NULL, NULL, 'married', NULL, '2026-08-04 02:34:24', '2026-08-04 02:38:28'),
('12', '14', 'Petrus Rustamadji', 'male', NULL, NULL, 'divorced', NULL, '2026-08-04 02:35:06', '2026-08-04 02:44:21'),
('13', '15', 'Marco Wanders', 'male', NULL, NULL, 'married', NULL, '2026-08-04 02:35:49', '2026-08-04 02:35:49'),
('14', '18', 'Bambang', 'male', NULL, NULL, 'married', NULL, '2026-08-04 02:37:57', '2026-08-04 02:37:57');

DROP TABLE IF EXISTS `user_branch_assignments`;
CREATE TABLE `user_branch_assignments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `family_member_id` bigint(20) unsigned NOT NULL,
  `assigned_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_branch_assignments_user_id_family_member_id_unique` (`user_id`,`family_member_id`),
  KEY `user_branch_assignments_family_member_id_foreign` (`family_member_id`),
  KEY `user_branch_assignments_assigned_by_foreign` (`assigned_by`),
  CONSTRAINT `user_branch_assignments_assigned_by_foreign` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `user_branch_assignments_family_member_id_foreign` FOREIGN KEY (`family_member_id`) REFERENCES `family_members` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_branch_assignments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'pending',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_approved_by_foreign` (`approved_by`),
  CONSTRAINT `users_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `status`, `approved_at`, `approved_by`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES
('1', 'Administrator', 'kurniawan@petalmail.com', NULL, '$2y$12$hds9VTWkzcxDViIKK80Qe.MQ2dmpyVe/9XYm4ldVSXCVnwDSNXrAq', 'superadmin', 'active', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-04 02:02:37', '2026-08-04 02:11:22'),
('2', 'Kurniawan', 'kurniawan.se@gmail.com', NULL, '$2y$12$9sFQm1JKio8UlNDrWPs1be9hLy/wiyYv8/oXrDDaEfu5QzkqS.tDm', 'editor', 'active', '2026-08-04 02:09:42', '1', NULL, NULL, NULL, NULL, '2026-08-04 02:05:58', '2026-08-04 02:10:09');

SET FOREIGN_KEY_CHECKS=1;
