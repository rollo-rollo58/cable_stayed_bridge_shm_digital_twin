"""Inspection and sensing station seed data for the demonstrator."""
from __future__ import annotations


def sensor_map() -> list[dict[str, object]]:
    result: list[dict[str, object]] = []
    for station in range(8):
        offset = round(station * 140.0, 1)
        result.extend(
            [
                {
                    "id": f"ACC-{station + 1:02d}",
                    "family": "accelerometer",
                    "station_m": offset,
                    "unit": "m/s²",
                    "status": "synthetic",
                },
                {
                    "id": f"STR-{station + 1:02d}",
                    "family": "strain",
                    "station_m": offset,
                    "unit": "µε",
                    "status": "synthetic",
                },
            ]
        )
    for cable in range(15):
        result.append(
            {
                "id": f"CAB-{cable + 1:02d}",
                "family": "cable",
                "station_m": round(70.0 + cable * 61.0, 1),
                "unit": "kN",
                "status": "synthetic",
            }
        )
    return result


def inspection_ledger() -> list[dict[str, str]]:
    return [
        {
            "id": "INSP-026-042",
            "zone": "Pylon N / anchorage bank",
            "date": "2026-09-14",
            "finding": "Routine inspection; imagery review completed",
            "severity": "routine",
        },
        {
            "id": "INSP-026-043",
            "zone": "Cable 07 / damper saddle",
            "date": "2026-10-03",
            "finding": "Additional close-range measurement recommended",
            "severity": "review",
        },
        {
            "id": "INSP-026-044",
            "zone": "Expansion joint / south approach",
            "date": "2026-10-27",
            "finding": "Seasonal movement within synthetic reference band",
            "severity": "routine",
        },
    ]


def dashboard_snapshot() -> dict[str, object]:
    cables = [
        {
            "code": f"C-{index + 1:02d}",
            "tension_kn": round(2380.0 + index * 47 + (index % 3) * 35.0, 1),
            "baseline_kn": round(2400.0 + index * 46.0, 1),
        }
        for index in range(15)
    ]
    return {
        "bridge": "Strait Crossing Demonstrator",
        "span_m": 980.0,
        "generated_mode": "synthetic research demonstration",
        "modes_hz": [0.842, 1.191, 1.654, 2.119, 2.501, 3.122],
        "deck_stations_m": [0, 140, 280, 420, 560, 700, 840, 980],
        "cables": cables,
        "alerts": [
            {
                "id": "A-107",
                "zone": "Cable 07",
                "severity": "review",
                "message": "Frequency trend crossing demo review threshold",
            },
            {
                "id": "A-108",
                "zone": "Midspan deck",
                "severity": "info",
                "message": "Wind compensation applied to strain baseline",
            },
        ],
        "metrics": {
            "median_mode_hz": 0.842,
            "max_strain_micro": 157.0,
            "peak_wind_ms": 14.8,
            "cable_force_spread_pct": 4.2,
        },
    }
