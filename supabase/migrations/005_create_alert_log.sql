CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS alert_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_key TEXT UNIQUE NOT NULL,
    brand TEXT NOT NULL CHECK (brand IN ('ngajigaes', 'labbaika', 'alaika')),
    type TEXT NOT NULL,
    campaign_id TEXT,
    message_text TEXT NOT NULL,
    payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    dry_run BOOLEAN NOT NULL DEFAULT FALSE,
    telegram_message_id TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_log_brand_sent_at
    ON alert_log (brand, sent_at DESC);
