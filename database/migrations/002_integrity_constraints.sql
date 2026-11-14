BEGIN;
CREATE TABLE IF NOT EXISTS cable_baselines (
    cable_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bridge_id UUID NOT NULL REFERENCES bridges(bridge_id),
    cable_code TEXT NOT NULL,
    unstrained_length_m DOUBLE PRECISION NOT NULL CHECK (unstrained_length_m > 0),
    mass_per_length_kg_m DOUBLE PRECISION NOT NULL CHECK (mass_per_length_kg_m > 0),
    baseline_frequency_hz DOUBLE PRECISION NOT NULL CHECK (baseline_frequency_hz > 0),
    baseline_force_kn DOUBLE PRECISION NOT NULL CHECK (baseline_force_kn > 0),
    UNIQUE (bridge_id, cable_code)
);
CREATE TABLE IF NOT EXISTS modal_baselines (
    baseline_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bridge_id UUID NOT NULL REFERENCES bridges(bridge_id),
    mode_number INTEGER NOT NULL CHECK (mode_number BETWEEN 1 AND 100),
    frequency_hz DOUBLE PRECISION NOT NULL CHECK (frequency_hz > 0),
    damping_ratio DOUBLE PRECISION NOT NULL CHECK (
        damping_ratio BETWEEN 0 AND 1
    ),
    UNIQUE (bridge_id, mode_number)
);
CREATE TABLE IF NOT EXISTS inspections (
    inspection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bridge_id UUID NOT NULL REFERENCES bridges(bridge_id),
    inspected_at TIMESTAMPTZ NOT NULL,
    area_code TEXT NOT NULL,
    assessment TEXT NOT NULL CHECK (
        assessment IN ('routine', 'review', 'urgent')
    ),
    note TEXT NOT NULL,
    inspector_reference TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inspections_bridge_time_idx
    ON inspections(bridge_id, inspected_at DESC);
COMMIT;
