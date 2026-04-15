-- ── FARMERS TABLE ─────────────────────────────────────────────
-- Stores basic farmer identity information
CREATE TABLE IF NOT EXISTS farmers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    phone       VARCHAR(15)         UNIQUE NOT NULL,
    email       VARCHAR(100)        UNIQUE,
    location    VARCHAR(150)        NOT NULL,
    created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ── FARMS TABLE ───────────────────────────────────────────────
-- Each farmer can have one farm (linked via farmer_id)
CREATE TABLE IF NOT EXISTS farms (
    id              SERIAL PRIMARY KEY,
    farmer_id       INT             NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    farm_name       VARCHAR(100)    NOT NULL,
    soil_type       VARCHAR(50)     NOT NULL,   -- e.g. loamy, sandy, clay
    crop_type       VARCHAR(50),                -- current/intended crop
    area_acres      DECIMAL(6,2),               -- farm size
    latitude        DECIMAL(9,6),               -- for weather API lookup
    longitude       DECIMAL(9,6),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ── WEATHER DATA TABLE ────────────────────────────────────────
-- Stores fetched weather snapshots per farm
CREATE TABLE IF NOT EXISTS weather_data (
    id              SERIAL PRIMARY KEY,
    farm_id         INT             NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    temperature     DECIMAL(5,2),               -- in Celsius
    humidity        DECIMAL(5,2),               -- percentage
    rainfall        DECIMAL(6,2),               -- mm
    wind_speed      DECIMAL(5,2),               -- km/h
    weather_desc    VARCHAR(100),               -- e.g. "clear sky"
    fetched_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ── RECOMMENDATIONS TABLE ─────────────────────────────────────
-- Stores AI/rule-based recommendations generated per farm
CREATE TABLE IF NOT EXISTS recommendations (
    id              SERIAL PRIMARY KEY,
    farm_id         INT             NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    rec_type        VARCHAR(50)     NOT NULL,   -- crop / irrigation / fertilizer
    message         TEXT            NOT NULL,   -- actual advice text
    generated_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);


-- Users table for login/register
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(100)  UNIQUE NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    role          VARCHAR(20)   DEFAULT 'farmer',
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);