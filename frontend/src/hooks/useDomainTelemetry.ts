"use client";

import { useEffect, useState } from "react";
import { connectTelemetry } from "@/lib/websocket-stream";
import type { TelemetrySample } from "@/types/domain";

export function useDomainTelemetry() {
  const [samples, setSamples] = useState<TelemetrySample[]>([]);
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");

  useEffect(() => {
    return connectTelemetry(
      (sample) => setSamples((items) => [...items.slice(-79), sample]),
      setStatus,
    );
  }, []);

  return {
    samples,
    latest: samples.length ? samples[samples.length - 1] : null,
    status,
  };
}
