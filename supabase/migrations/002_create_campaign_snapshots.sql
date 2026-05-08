CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS campaign_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand TEXT NOT NULL CHECK (brand IN ('ngajigaes', 'labbaika', 'alaika')),
    campaign_id TEXT NOT NULL,
    campaign_name TEXT NOT NULL,
    adset_id TEXT,
    adset_name TEXT,
    ad_id TEXT,
    ad_name TEXT,
    level TEXT NOT NULL CHECK (level IN ('campaign', 'adset', 'ad')),
    date_start DATE NOT NULL,
    date_stop DATE NOT NULL,
    spend NUMERIC(12,2),
    reach INTEGER,
    impressions INTEGER,
    clicks INTEGER,
    ctr NUMERIC(6,4),
    cpm NUMERIC(10,2),
    frequency NUMERIC(6,4),
    purchases INTEGER,
    purchase_value NUMERIC(12,2),
    leads INTEGER,
    roas NUMERIC(8,4),
    cpl NUMERIC(10,2),
    cpp NUMERIC(10,2),
    status TEXT,
    fetched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_kpi_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand TEXT NOT NULL CHECK (brand IN ('ngajigaes', 'labbaika', 'alaika')),
    campaign_id TEXT NOT NULL,
    kpi_type TEXT NOT NULL CHECK (kpi_type IN ('roas', 'cpl', 'cpp', 'reach', 'spend')),
    target_value NUMERIC(12,4) NOT NULL,
    set_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, kpi_type)
);

CREATE INDEX IF NOT EXISTS idx_campaign_snapshots_brand_date
    ON campaign_snapshots(brand, date_start DESC);

CREATE INDEX IF NOT EXISTS idx_campaign_snapshots_campaign_level
    ON campaign_snapshots(campaign_id, level);

CREATE INDEX IF NOT EXISTS idx_campaign_snapshots_fetched_at
    ON campaign_snapshots(fetched_at DESC);
