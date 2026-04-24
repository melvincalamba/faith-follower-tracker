CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255)        NOT NULL,
    role        VARCHAR(20)         NOT NULL 
                CHECK (role IN ('admin', 'mentor')),
    created_at  TIMESTAMP           DEFAULT NOW()
);

CREATE TABLE classifications (
    id    SERIAL PRIMARY KEY,
    label VARCHAR(50) UNIQUE NOT NULL
);

-- Seed Data
INSERT INTO classifications (label) VALUES
    ('Grade School'),
    ('Junior High'),
    ('Senior High'),
    ('Undergrad'),
    ('Professional'),
    ('TBA');

CREATE TABLE progress_stages (
    id           SERIAL PRIMARY KEY,
    label        VARCHAR(50) UNIQUE NOT NULL,
    stage_order  INT UNIQUE         NOT NULL
);

-- Seed Data
INSERT INTO progress_stages (label, stage_order) VALUES
    ('Pre-FIC',      1),
    ('FIC1',         2),
    ('FIC2',         3),
    ('Pre-CellDev',  4),
    ('CellDev',      5);

CREATE TABLE members (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    mentor_id           INT REFERENCES users(id)
                            ON DELETE SET NULL,
    progress_stage_id   INT REFERENCES progress_stages(id)
                            ON DELETE SET NULL,
    classification_id   INT REFERENCES classifications(id)
                            ON DELETE SET NULL,
    details             TEXT,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);