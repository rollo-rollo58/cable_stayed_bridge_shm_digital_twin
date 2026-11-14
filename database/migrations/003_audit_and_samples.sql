BEGIN;
CREATE TABLE IF NOT EXISTS analysis_events (
    analysis_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bridge_id UUID NOT NULL REFERENCES bridges(bridge_id),
    requested_by TEXT NOT NULL,
    input_digest TEXT NOT NULL,
    score DOUBLE PRECISION NOT NULL CHECK (score BETWEEN 0 AND 100),
    outcome TEXT NOT NULL CHECK (outcome IN ('nominal', 'review', 'investigate')),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sensor_calibration_records (
    calibration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id UUID NOT NULL REFERENCES sensor_channels(sensor_id),
    performed_at TIMESTAMPTZ NOT NULL,
    traceability_reference TEXT NOT NULL,
    uncertainty_fraction DOUBLE PRECISION NOT NULL CHECK (
        uncertainty_fraction BETWEEN 0 AND 1
    ),
    certificate_digest TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analysis_bridge_date_idx
    ON analysis_events(bridge_id, recorded_at DESC);
INSERT INTO bridges (display_name, design_span_m, commissioned_on)
VALUES ('Strait Crossing Demonstrator', 980.000, '2011-06-01')
ON CONFLICT (display_name) DO NOTHING;
COMMIT;
