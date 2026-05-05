-- Idagdag ang status column sa users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS status VARCHAR(20)
DEFAULT 'pending'
CHECK (status IN ('pending', 'active'));

-- Ang existing users (admin) ay active na
UPDATE users SET status = 'active' WHERE role = 'admin';