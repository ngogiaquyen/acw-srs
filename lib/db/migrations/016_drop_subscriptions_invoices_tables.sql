-- Migration: Drop subscriptions and invoices tables
-- Date: 2026-03-09

-- Xóa foreign key constraint trước (nếu có)
ALTER TABLE invoices DROP FOREIGN KEY IF EXISTS invoices_ibfk_2;

-- Xóa bảng subscriptions trước (vì invoices có thể tham chiếu)
DROP TABLE IF EXISTS subscriptions;

-- Xóa bảng invoices
DROP TABLE IF EXISTS invoices;
