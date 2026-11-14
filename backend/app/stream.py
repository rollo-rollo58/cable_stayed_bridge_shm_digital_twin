"""Deterministic simulated sensor stream via Server-Sent Events."""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
import json
import math
import time
from collections.abc import AsyncIterator


async def synthetic_events() -> AsyncIterator[str]:
    index = 0
    while True:
        index += 1
        phase = time.monotonic() * 0.19
        sample = {
            "sequence": index,
            "captured_at": datetime.now(timezone.utc).isoformat(),
            "mode_hz": round(0.842 + 0.006 * math.sin(phase), 4),
            "wind_ms": round(11.2 + 2.1 * math.sin(phase * 0.31), 2),
            "strain_micro": round(146.0 + 11.0 * math.cos(phase * 0.8), 2),
            "deck_accel_ms2": round(0.23 + 0.06 * abs(math.sin(phase * 1.7)), 3),
            "synthetic": True,
        }
        yield f"event: observation\ndata: {json.dumps(sample)}\n\n"
        await asyncio.sleep(1.5)
