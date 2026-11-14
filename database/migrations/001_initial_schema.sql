BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS bridges (
    bridge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name TEXT NOT NULL UNIQUE,
    design_span_m NUMERIC(12, 3) NOT NULL CHECK (design_span_m > 0),
    commissioned_on DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sensor_channels (
    sensor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bridge_id UUID NOT NULL REFERENCES bridges(bridge_id) ON DELETE CASCADE,
    channel_code TEXT NOT NULL,
    sensor_type TEXT NOT NULL CHECK (
        sensor_type IN ('accelerometer', 'strain', 'temperature', 'anemometer', 'cable')
    ),
    station_m NUMERIC(12, 3) NOT NULL CHECK (station_m >= 0),
    unit_label TEXT NOT NULL,
    calibration_due_at TIMESTAMPTZ NOT NULL,
    UNIQUE (bridge_id, channel_code)
);
CREATE TABLE IF NOT EXISTS observations (
    observation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sensor_id UUID NOT NULL REFERENCES sensor_channels(sensor_id),
    observed_at TIMESTAMPTZ NOT NULL,
    measured_value DOUBLE PRECISION NOT NULL,
    quality_flag TEXT NOT NULL DEFAULT 'good' CHECK (
        quality_flag IN ('good', 'suspect', 'missing')
    ),
    inserted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (sensor_id, observed_at)
);
CREATE INDEX IF NOT EXISTS observations_channel_time_idx
    ON observations(sensor_id, observed_at DESC);
COMMIT;
