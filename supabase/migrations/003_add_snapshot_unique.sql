UPDATE campaign_snapshots
SET
    adset_id = COALESCE(adset_id, ''),
    ad_id = COALESCE(ad_id, '')
WHERE adset_id IS NULL OR ad_id IS NULL;

ALTER TABLE campaign_snapshots
    ALTER COLUMN adset_id SET DEFAULT '',
    ALTER COLUMN adset_id SET NOT NULL,
    ALTER COLUMN ad_id SET DEFAULT '',
    ALTER COLUMN ad_id SET NOT NULL;

ALTER TABLE campaign_snapshots
    ADD CONSTRAINT uq_snapshot_identity
    UNIQUE (brand, campaign_id, adset_id, ad_id, level, date_start, date_stop);
