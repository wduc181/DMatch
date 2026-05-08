-- Thêm field industry và cover_key cho Company entity (hỗ trợ Company Listing Page)
ALTER TABLE companies ADD COLUMN industry VARCHAR(255);
ALTER TABLE companies ADD COLUMN cover_key VARCHAR(255);
