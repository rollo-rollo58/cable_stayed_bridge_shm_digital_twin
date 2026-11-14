import type {
  AnalysisResult,
  BridgeObservation,
  BridgeSnapshot,
  Inspection,
  ScenarioComparison,
} from "@/types/domain";

const root = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${root}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }
  return (await response.json()) as T;
}

export async function getOverview(): Promise<BridgeSnapshot> {
  return request<BridgeSnapshot>("/api/v1/overview");
}

export async function getInspections(): Promise<Inspection[]> {
  return request<Inspection[]>("/api/v1/inspections");
}

export async function analyzeObservation(input: BridgeObservation): Promise<AnalysisResult> {
  return request<AnalysisResult>("/api/v1/analyze", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function compareScenario(
  baseline: BridgeObservation,
  windMultiplier: number,
  trafficMultiplier: number,
  thermalOffset: number,
): Promise<ScenarioComparison> {
  return request<ScenarioComparison>("/api/v1/scenarios", {
    method: "POST",
    body: JSON.stringify({
      baseline,
      wind_multiplier: windMultiplier,
      traffic_multiplier: trafficMultiplier,
      thermal_offset_c: thermalOffset,
    }),
  });
}
