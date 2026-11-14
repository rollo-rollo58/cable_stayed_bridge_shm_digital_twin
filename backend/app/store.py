"""Bounded demo event ring; persistent schema is supplied in migrations."""
from __future__ import annotations

from collections import deque
from datetime import datetime, timezone
from threading import Lock


class ObservationLog:
    def __init__(self, limit: int = 512) -> None:
        self._events: deque[dict[str, object]] = deque(maxlen=limit)
        self._lock = Lock()
        self._serial = 0

    def append(self, sensor_code: str, value: float, unit: str) -> dict[str, object]:
        with self._lock:
            self._serial += 1
            record: dict[str, object] = {
                "serial": self._serial,
                "sensor_code": sensor_code,
                "value": value,
                "unit": unit,
                "observed_at": datetime.now(timezone.utc).isoformat(),
            }
            self._events.append(record)
            return dict(record)

    def latest(self, count: int = 30) -> list[dict[str, object]]:
        with self._lock:
            return [dict(item) for item in list(self._events)[-count:]][::-1]


observation_log = ObservationLog()
