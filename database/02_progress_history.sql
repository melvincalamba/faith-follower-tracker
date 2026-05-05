CREATE TABLE IF NOT EXISTS progress_history (
    id          SERIAL PRIMARY KEY,
    member_id   INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    from_stage  VARCHAR(50),
    to_stage    VARCHAR(50) NOT NULL,
    changed_by  INT REFERENCES users(id) ON DELETE SET NULL,
    notes       TEXT,
    changed_at  TIMESTAMP DEFAULT NOW()
);