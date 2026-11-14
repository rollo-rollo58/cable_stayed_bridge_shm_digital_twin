export type Severity = "info" | "review" | "investigate";

export type BridgeCable = {
  code: string;
  tension_kn: number;
  baseline_kn: number;
};

export type BridgeAlert = {
  id: string;
  zone: string;
  severity: Severity;
  message: string;
};

export type BridgeSnapshot = {
  bridge: string;
  span_m: number;
  generated_mode: string;
  modes_hz: number[];
  deck_stations_m: number[];
  cables: BridgeCable[];
  alerts: BridgeAlert[];
  metrics: {
    median_mode_hz: number;
    max_strain_micro: number;
    peak_wind_ms: number;
    cable_force_spread_pct: number;
  };
};

export type TelemetrySample = {
  sequence: number;
  captured_at: string;
  mode_hz: number;
  wind_ms: number;
  strain_micro: number;
  deck_accel_ms2: number;
  synthetic: boolean;
};

export type BridgeObservation = {
  modal_frequency_hz: number;
  modal_baseline_hz: number;
  deck_acceleration_ms2: number;
  wind_speed_ms: number;
  deck_temperature_c: number;
  baseline_temperature_c: number;
  longitudinal_strain_micro: number;
  annual_stress_cycles: number;
  stress_range_mpa: number;
};

export type AnalysisResult = {
  indicators: Record<string, number>;
  risk_contributions: Record<string, number>;
  risk_score: number;
  condition: "nominal" | "review" | "investigate";
  interpretation: string;
};

export type ScenarioComparison = {
  baseline: AnalysisResult;
  scenario: AnalysisResult;
  risk_change: number;
  assumption: string;
};

export type Inspection = {
  id: string;
  zone: string;
  date: string;
  finding: string;
  severity: "routine" | "review" | "urgent";
};

export const fallbackSnapshot: BridgeSnapshot = {
  bridge: "Strait Crossing Demonstrator",
  span_m: 980,
  generated_mode: "synthetic research demonstration",
  modes_hz: [0.842, 1.191, 1.654, 2.119, 2.501, 3.122],
  deck_stations_m: [0, 140, 280, 420, 560, 700, 840, 980],
  cables: Array.from({ length: 15 }, (_, index) => ({
    code: `C-${String(index + 1).padStart(2, "0")}`,
    tension_kn: 2380 + index * 47 + (index % 3) * 35,
    baseline_kn: 2400 + index * 46,
  })),
  alerts: [
    {
      id: "A-107",
      zone: "Cable 07",
      severity: "review",
      message: "Frequency trend crossing demo review threshold",
    },
    {
      id: "A-108",
      zone: "Midspan deck",
      severity: "info",
      message: "Wind compensation applied to strain baseline",
    },
  ],
  metrics: {
    median_mode_hz: 0.842,
    max_strain_micro: 157,
    peak_wind_ms: 14.8,
    cable_force_spread_pct: 4.2,
  },
};

export const baseObservation: BridgeObservation = {
  modal_frequency_hz: 0.842,
  modal_baseline_hz: 0.850,
  deck_acceleration_ms2: 0.23,
  wind_speed_ms: 11.2,
  deck_temperature_c: 27.0,
  baseline_temperature_c: 21.0,
  longitudinal_strain_micro: 146.0,
  annual_stress_cycles: 115000,
  stress_range_mpa: 62,
};
