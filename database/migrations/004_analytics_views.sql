BEGIN;
CREATE OR REPLACE VIEW sensor_channel_health AS
SELECT
    s.bridge_id,
    s.channel_code,
    s.sensor_type,
    s.calibration_due_at,
    COUNT(o.observation_id) AS observation_count,
    MAX(o.observed_at) AS last_observed_at,
    COUNT(o.observation_id) FILTER (
        WHERE o.quality_flag = 'suspect'
    ) AS suspect_count
FROM sensor_channels s
LEFT JOIN observations o ON o.sensor_id = s.sensor_id
GROUP BY s.bridge_id, s.channel_code, s.sensor_type, s.calibration_due_at;
CREATE OR REPLACE VIEW inspection_monthly_summary AS
SELECT
    bridge_id,
    date_trunc('month', inspected_at) AS inspection_month,
    assessment,
    COUNT(*) AS assessment_count
FROM inspections
GROUP BY bridge_id, date_trunc('month', inspected_at), assessment;
CREATE OR REPLACE VIEW analysis_daily_risk AS
SELECT
    bridge_id,
    date_trunc('day', recorded_at) AS analysis_day,
    COUNT(*) AS assessment_count,
    AVG(score) AS mean_score,
    MAX(score) AS peak_score
FROM analysis_events
GROUP BY bridge_id, date_trunc('day', recorded_at);
COMMIT;
