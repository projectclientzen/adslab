CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS ads_detail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    library_id TEXT UNIQUE NOT NULL,
    advertiser_name TEXT,
    ad_copy TEXT,
    creative_type TEXT CHECK (creative_type IN ('image', 'video', 'carousel')),
    cta_button TEXT,
    destination_url TEXT,
    date_active TIMESTAMPTZ,
    funnel_type TEXT CHECK (funnel_type IN ('LP', 'CTWA', 'Visit Profile', 'Lead Form')),
    funnel_override TEXT,
    campaign_stage TEXT CHECK (campaign_stage IN ('TOFU', 'MOFU', 'BOFU')),
    stage_confidence FLOAT CHECK (stage_confidence >= 0 AND stage_confidence <= 1),
    stage_override TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ads_detail_advertiser ON ads_detail(advertiser_name);
CREATE INDEX IF NOT EXISTS idx_ads_detail_funnel ON ads_detail(funnel_type);
CREATE INDEX IF NOT EXISTS idx_ads_detail_created ON ads_detail(created_at DESC);
