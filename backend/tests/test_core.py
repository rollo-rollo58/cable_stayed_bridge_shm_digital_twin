"""Unit and HTTP tests for the explicitly implemented math and contracts."""
from __future__ import annotations

import math
import os

from fastapi.testclient import TestClient
import pytest

from app.analytics import evaluate
from app.main import create_app
from app.physics import (
    cable_frequency_hz,
    damped_amplitude,
    engineering_stress_mpa,
    miner_damage,
    modal_shift_percent,
    tension_from_mode_kn,
    thermal_movement_mm,
)
from app.schemas import BridgeObservation


BASE = {
    "modal_frequency_hz": 0.84,
    "modal_baseline_hz": 0.85,
    "deck_acceleration_ms2": 0.21,
    "wind_speed_ms": 12.3,
    "deck_temperature_c": 25.0,
    "baseline_temperature_c": 22.0,
    "longitudinal_strain_micro": 115.0,
    "annual_stress_cycles": 100000,
    "stress_range_mpa": 52.0,
}


def test_stress_units() -> None:
    assert engineering_stress_mpa(1000.0, 200.0) == pytest.approx(200.0)


def test_modal_frequency_and_tension_are_inverse() -> None:
    tension = tension_from_mode_kn(0.8, 90.0, 65.0)
    assert cable_frequency_hz(tension, 90.0, 65.0) == pytest.approx(0.8)


def test_thermal_movement() -> None:
    assert thermal_movement_mm(100.0, 10.0) == pytest.approx(12.0)


def test_modal_shift() -> None:
    assert modal_shift_percent(0.95, 1.0) == pytest.approx(5.0)


def test_miner_damage_monotonic() -> None:
    assert miner_damage(10000, 80) < miner_damage(20000, 80)


def test_damped_amplitude_decreases() -> None:
    assert damped_amplitude(5, 0.04, 1.0, 3) < 5


def test_reject_invalid_force() -> None:
    with pytest.raises(ValueError):
        tension_from_mode_kn(-1, 90, 65)


def test_calculation_is_bounded() -> None:
    answer = evaluate(BridgeObservation(**BASE))
    assert answer["condition"] in {"nominal", "review", "investigate"}
    assert 0 <= answer["risk_score"] <= 100


def test_health() -> None:
    client = TestClient(create_app())
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["mode"] == "synthetic"


def test_overview_and_sensors() -> None:
    client = TestClient(create_app())
    assert len(client.get("/api/v1/sensors").json()) == 31
    assert len(client.get("/api/v1/overview").json()["cables"]) == 15


def test_analyze_validation() -> None:
    client = TestClient(create_app())
    assert client.post("/api/v1/analyze", json=BASE).status_code == 200
    invalid = dict(BASE, modal_frequency_hz=-1.0)
    assert client.post("/api/v1/analyze", json=invalid).status_code == 422


def test_mutation_disabled_without_operator_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPERATOR_API_KEY", raising=False)
    client = TestClient(create_app())
    response = client.post(
        "/api/v1/ingest",
        json={"sensor_code": "ACC-01", "value": 0.4, "unit": "m/s2"},
    )
    assert response.status_code == 503


def test_operator_protected_mutation(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("OPERATOR_API_KEY", "test-only-secret")
    client = TestClient(create_app())
    body = {"sensor_code": "ACC-01", "value": 0.4, "unit": "m/s2"}
    assert client.post("/api/v1/ingest", json=body).status_code == 401
    accepted = client.post(
        "/api/v1/ingest",
        json=body,
        headers={"X-Operator-Key": "test-only-secret"},
    )
    assert accepted.status_code == 200
    assert accepted.json()["sensor_code"] == "ACC-01"


def test_scenario_comparison() -> None:
    client = TestClient(create_app())
    response = client.post(
        "/api/v1/scenarios",
        json={
            "baseline": BASE,
            "wind_multiplier": 1.2,
            "traffic_multiplier": 1.3,
            "thermal_offset_c": 2.0,
        },
    )
    assert response.status_code == 200
    assert math.isfinite(response.json()["risk_change"])


def test_policy_route_works() -> None:
    client = TestClient(create_app())
    body = {"observed": 0.83, "reference": 0.85, "variability": 0.3, "exposure": 8}
    response = client.post("/api/v1/policies/modal/17", json=body)
    assert response.status_code == 200
    assert 0 <= response.json()["score"] <= 100
