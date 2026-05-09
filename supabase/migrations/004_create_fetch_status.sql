CREATE TABLE IF NOT EXISTS fetch_status (
    brand TEXT PRIMARY KEY CHECK (brand IN ('ngajigaes', 'labbaika', 'alaika')),
    last_fetched_at TIMESTAMPTZ,
    status TEXT CHECK (status IN ('success', 'error')),
    error_message TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO fetch_status (brand)
VALUES
    ('ngajigaes'),
    ('labbaika'),
    ('alaika')
ON CONFLICT (brand) DO NOTHING;
