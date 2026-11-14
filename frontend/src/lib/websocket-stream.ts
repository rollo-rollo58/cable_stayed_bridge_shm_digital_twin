import type { TelemetrySample } from "@/types/domain";

const root = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function connectTelemetry(
  onSample: (sample: TelemetrySample) => void,
  onStatus: (status: "connected" | "disconnected") => void,
): () => void {
  const source = new EventSource(`${root}/api/v1/stream`);
  source.addEventListener("open", () => onStatus("connected"));
  source.addEventListener("error", () => onStatus("disconnected"));
  const listener = (event: MessageEvent) => {
    try {
      const payload = JSON.parse(event.data) as TelemetrySample;
      if (payload.synthetic && Number.isFinite(payload.mode_hz)) {
        onSample(payload);
      }
    } catch {
      onStatus("disconnected");
    }
  };
  source.addEventListener("observation", listener);
  return () => {
    source.removeEventListener("observation", listener);
    source.close();
  };
}
