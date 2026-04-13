ALTER TABLE devices
DROP COLUMN status;

ALTER TABLE tenants
ADD COLUMN allow_expired_access BOOLEAN DEFAULT FALSE
AFTER subscription_end_date;