-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 09, 2026 at 07:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e-commerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba', 'i:3;', 1794206571),
('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba:timer', 'i:1794206571;', 1794206571);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

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
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `shop_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `thumbnail` varchar(2048) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`id`, `shop_id`, `product_id`, `name`, `description`, `price`, `thumbnail`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Stoneware Everyday Mug', 'A warm ceramic companion for your morning ritual. Finished with a soft, earthy glaze.', 24.00, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(2, 2, 2, 'The Everyday Tote', 'An uncomplicated cotton canvas carryall. Room for your essentials and a little extra.', 32.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(3, 3, 3, 'Amber & Cedar Candle', 'Slow down with warm amber and woodsy cedar. Hand poured for quiet evenings at home.', 28.00, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(4, 1, 4, 'Linen Notebook Set', 'For ideas worth keeping. A pair of linen-bound notebooks with smooth, uncoated pages.', 18.00, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(5, 2, 5, 'Little Green Companion', 'Bring a little nature indoors. An easy-care houseplant in a minimal ceramic pot.', 22.00, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=700&q=80', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(6, 3, 6, 'Sunday Pour-Over', 'A considered start to your day. A simple glass coffee maker for your favorite roast.', 46.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(7, 1, 7, 'Everyday Essentials Pouch', 'A compact companion for the things that matter. Soft fabric, considered details.', 16.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(8, 2, 8, 'Quiet Morning Journal', 'Space to pause, reflect, and make a little room for yourself. Your daily ritual, on paper.', 20.00, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=80', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(9, 2, 1, 'Slow Morning Stoneware Mug', 'Our studio favorite, with a soft earthy glaze. Make every coffee a quiet moment.', 26.00, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_11_09_000001_create_marketplace_tables', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `thumbnail` varchar(2048) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `created_by`, `name`, `sku`, `category`, `description`, `price`, `thumbnail`, `created_at`, `updated_at`) VALUES
(1, 1, 'Stoneware Everyday Mug', 'CG-001', 'Home & Living', 'A warm ceramic companion for your morning ritual. Finished with a soft, earthy glaze.', 24.00, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80', '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(2, 2, 'The Everyday Tote', 'CG-002', 'Accessories', 'An uncomplicated cotton canvas carryall. Room for your essentials and a little extra.', 32.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80', '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(3, 3, 'Amber & Cedar Candle', 'CG-003', 'Home & Living', 'Slow down with warm amber and woodsy cedar. Hand poured for quiet evenings at home.', 28.00, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80', '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(4, 1, 'Linen Notebook Set', 'CG-004', 'Stationery', 'For ideas worth keeping. A pair of linen-bound notebooks with smooth, uncoated pages.', 18.00, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80', '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(5, 2, 'Little Green Companion', 'CG-005', 'Lifestyle', 'Bring a little nature indoors. An easy-care houseplant in a minimal ceramic pot.', 22.00, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=700&q=80', '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(6, 3, 'Sunday Pour-Over', 'CG-006', 'Home & Living', 'A considered start to your day. A simple glass coffee maker for your favorite roast.', 46.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80', '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(7, 1, 'Everyday Essentials Pouch', 'CG-007', 'Accessories', 'A compact companion for the things that matter. Soft fabric, considered details.', 16.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80', '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(8, 2, 'Quiet Morning Journal', 'CG-008', 'Stationery', 'Space to pause, reflect, and make a little room for yourself. Your daily ritual, on paper.', 20.00, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=80', '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(9, 3, 'Weekend Ceramic Vase', 'CG-009', 'Home & Living', 'An organic silhouette for dried stems or fresh flowers. A small piece with a warm presence.', 36.00, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=80', '2026-11-09 00:36:14', '2026-11-09 00:36:14');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('2lebsSCejcs795mDZwXtiuNSBWGb5tgFElC9NpIa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic1c3bU44akpCTkNYUk5rc3hnMG9RQ1NyQkFTQ0VQazhicWs2aTE3MyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmVmcm9udD9wYWdlPTEmc2VhcmNoPSZzaG9wPSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794206523),
('8MrA15KUaNpdyVKZYAsICG1fxomi4MT9EdMCkwrB', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiRk9vUVdkVXJTZEN1dUU4VFJsYkRkRDBIeTRyTVYxdVBaQ3VmNnpNZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToyO3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiI2Nzc3MDdjMDk1YWZkZjRlOGFmYmE1ZGE3YTgzYjgyNzQ4MGEyNDNmYWQ2ZGQyMDNjNDZjZWM4NGExYmZiOGZmIjt9', 1794206519),
('9nQqyahDjEc3rzplcvZpZUvB0LjIpavsTcVjdIY1', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiWDNOcm4weXVrbVpTTHhpR1VNakIyOHVvMEhuYU8yUHI1Ujh3MzVpcCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkIjtzOjU6InJvdXRlIjtOO31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiJlODdjNzk2MGU3MzY1YmUzMWU3ZmZkN2Q5M2Y5MzA5ODNlODllY2FlMjNhNjEzNzEzOTUxMzZmZDQzNmYzZTliIjt9', 1794206785),
('C9sKWPLbT3kZAuZI9FRZL4oiBxMBMXnS24tYhol1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNGVFcVhBQUJTV3FpcExTREx5NUk0QndrN0dMU2NvQWNwbkpKb2QwZiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmVmcm9udD9wYWdlPTEmc2VhcmNoPSZzaG9wPSI7czo1OiJyb3V0ZSI7Tjt9fQ==', 1794206509),
('f6k0ExxlfKUsQBOraqCbV26SGir7EPXlT3H9H5qi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkc2b3BTaGtQZ2NFQldVakowUWwwRXBxZ1MyQ2hZalI2blNURnNYYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1794206509),
('Fdejx9yFiihzyyBhIqM8PmAqD3WFVqNiZ15IapYJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia0pOeUtlanJ4bHV0U3RObFpCcU80b0dnb2NiNWt1c0NMNUxyNjZMMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmVmcm9udD9wYWdlPTEmc2VhcmNoPSZzaG9wPSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794206449),
('fFe2WmDyOye5X8WLRaubil0dkYYVniVka6YQMOsU', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiWXBBU2l1Q3dFNjFOSUp5QkxKQk9pNWFWWm1GbGNEMVBYTTNiQjJiSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiJlODdjNzk2MGU3MzY1YmUzMWU3ZmZkN2Q5M2Y5MzA5ODNlODllY2FlMjNhNjEzNzEzOTUxMzZmZDQzNmYzZTliIjt9', 1794206458),
('GvPtzFwzGSPhfx1srvT2IRp5DNkdhyakd2RM3zjR', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoia1N6MnJleG9kQ0RWSGNHcHR2aWk4NzVzTDM3ZlRZVTZaWVkzRlE5SSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToyO3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiI2Nzc3MDdjMDk1YWZkZjRlOGFmYmE1ZGE3YTgzYjgyNzQ4MGEyNDNmYWQ2ZGQyMDNjNDZjZWM4NGExYmZiOGZmIjt9', 1794206465),
('GzLrh4GmMQfywuhVTuHMavgyH44OAOlUbX9rEJiK', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2dtNzRRbFdtTnJUSVJkWkhVWU95OWpzbGU3NjkzdHBzeE1yVHZIUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmVmcm9udD9wYWdlPTEmc2VhcmNoPSZzaG9wPSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794206468),
('jpjrzSKbhuLTLahLioXBFlPlWpYNpXoHhRWGCOve', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVFcwUTJMUmREa1diVDZzYW13T0VxZ0U1Wnlyd2Jnb3BqNjlpMHJ6cCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmVmcm9udD9wYWdlPTEmc2VhcmNoPSZzaG9wPSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794206472),
('p2mXhdn7GUr0SLaWA8JbKfh46V4fIGJhnlBTm1g2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUpEWHRhMnpNY1JiVnV5Z1E0VGFXM1VZVUFHRVlIODhRWEJxdlBsMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmVmcm9udD9wYWdlPTEmc2VhcmNoPSZzaG9wPSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794206497),
('T7yTGA6aFYpxAWTSW4jMbRlTKDa8ghJk5r3UuJDk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZE45N2Y5VTdWMWFZb1lOS3pCc3Y2bHFrOUFBZWtBVmxXRVRud3dMbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Nzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmVmcm9udD9jYXRlZ29yeT1TdGF0aW9uZXJ5JnBhZ2U9MSZzZWFyY2g9JnNob3A9IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1794206077),
('tFi60qkTpM080ZCFrig9XBOnZRtjJEKpQA994VQt', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiTlZSUzRtUWFvZlZhbXRFaEtoNHA0TFdUbjdWcGFhcG1YVUdRV25CbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToyO3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiI2Nzc3MDdjMDk1YWZkZjRlOGFmYmE1ZGE3YTgzYjgyNzQ4MGEyNDNmYWQ2ZGQyMDNjNDZjZWM4NGExYmZiOGZmIjt9', 1794206515),
('THB2QhdhDd5FsBHx3MrCOWY9dCWUK5qpPFGcBpGi', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiM0diQXdUQWxzdU1aRkprZFBqRjRpN3o4aWplendSZlk5bnVDb2Y1QiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToyO3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiI2Nzc3MDdjMDk1YWZkZjRlOGFmYmE1ZGE3YTgzYjgyNzQ4MGEyNDNmYWQ2ZGQyMDNjNDZjZWM4NGExYmZiOGZmIjt9', 1794206469),
('VD5FrR678GZ1qHZUbVTqbtuHcPWf2OcC4tG3AySJ', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiSjd2VnJOTnZ5YXFVbEU3OFpyblVyc2NGQjdLZmVZVVBrNTdJT3F3dCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiJlODdjNzk2MGU3MzY1YmUzMWU3ZmZkN2Q5M2Y5MzA5ODNlODllY2FlMjNhNjEzNzEzOTUxMzZmZDQzNmYzZTliIjt9', 1794206473),
('wgRVqFkAkN40HrdIkmg73YWqHPKk2EGFIUYh5m4E', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDNKY3ZvejkxZ0xWeVFSZnJhTURQSmpIRlFjR3JBSXZTV0tjcmc5cCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvc3RvcmVmcm9udD9wYWdlPTEmc2VhcmNoPSZzaG9wPSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1794206518),
('xKiOiyMgoAIUQkUbPyR60LFBWgTfI3aOZ5ADCawE', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiT1ZSYUNGUVE1azRxdEpnQWFsS0d6VDdwMkJLOGdsNnk5OXVkMWc3OSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZGFzaGJvYXJkIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjY0OiJlODdjNzk2MGU3MzY1YmUzMWU3ZmZkN2Q5M2Y5MzA5ODNlODllY2FlMjNhNjEzNzEzOTUxMzZmZDQzNmYzZTliIjt9', 1794206523);

-- --------------------------------------------------------

--
-- Table structure for table `shops`
--

CREATE TABLE `shops` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `owner_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shops`
--

INSERT INTO `shops` (`id`, `owner_id`, `name`, `slug`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2, 'The Home Edit', 'the-home-edit', 'Considered objects for comfortable spaces.', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(2, 3, 'Slow Studio', 'slow-studio', 'Simple things. Slower days.', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14'),
(3, 2, 'Field & Form', 'field-and-form', 'Everyday essentials with a natural touch.', 1, '2026-11-09 00:36:14', '2026-11-09 00:36:14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'owner'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`) VALUES
(1, 'Omar Faruk Shawon', 'admin@example.com', NULL, '$2y$12$1VQ54SWyS7xEF2dsXNXDpe32f2/o3kt.2vk7LR17XKmHGVwOCiCru', NULL, '2026-11-09 00:36:14', '2026-11-09 00:36:14', 'admin'),
(2, 'Mia Parker', 'owner@example.com', NULL, '$2y$12$YbDnyfFtSDw6m1CKWOcFPuaxEu1dnQacch/egCl6U2hsP0lRJtEZ2', NULL, '2026-11-09 00:36:14', '2026-11-09 00:36:14', 'owner'),
(3, 'Sam Wilson', 'sam@example.com', NULL, '$2y$12$a23t9YTr9EIVmJVR8xIGDuZlF9OVJOavFImTT14S2vAHM6POtZZ72', NULL, '2026-11-09 00:36:14', '2026-11-09 00:36:14', 'owner');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `listings_shop_id_product_id_unique` (`shop_id`,`product_id`),
  ADD KEY `listings_product_id_foreign` (`product_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_sku_unique` (`sku`),
  ADD KEY `products_created_by_foreign` (`created_by`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `shops`
--
ALTER TABLE `shops`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `shops_slug_unique` (`slug`),
  ADD KEY `shops_owner_id_foreign` (`owner_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `shops`
--
ALTER TABLE `shops`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `listings_shop_id_foreign` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `shops`
--
ALTER TABLE `shops`
  ADD CONSTRAINT `shops_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
