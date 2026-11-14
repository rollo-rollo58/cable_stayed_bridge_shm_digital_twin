"""Explainable feature aggregation for the bridge research demonstrator."""
from __future__ import annotations

from .physics import (
    engineering_stress_mpa,
    miner_damage,
    modal_shift_percent,
    thermal_movement_mm,
)
from .schemas import BridgeObservation


def evaluate(observation: BridgeObservation) -> dict[str, object]:
    shift = modal_shift_percent(
        observation.modal_frequency_hz,
        observation.modal_baseline_hz,
    )
    stress = engineering_stress_mpa(observation.longitudinal_strain_micro)
    movement = thermal_movement_mm(
        980.0,
        observation.deck_temperature_c - observation.baseline_temperature_c,
    )
    fatigue = miner_damage(
        observation.annual_stress_cycles,
        observation.stress_range_mpa,
    )
    indicators = {
        "modal_shift_pct": round(shift, 4),
        "stress_mpa": round(stress, 4),
        "thermal_movement_mm": round(movement, 4),
        "miner_damage_proxy": round(fatigue, 6),
        "wind_ms": observation.wind_speed_ms,
        "deck_acceleration_ms2": observation.deck_acceleration_ms2,
    }
    contributions = {
        "modal": min(40.0, shift * 9.0),
        "wind": min(15.0, observation.wind_speed_ms * 0.35),
        "acceleration": min(15.0, observation.deck_acceleration_ms2 * 5.0),
        "stress": min(15.0, abs(stress) * 0.07),
        "fatigue": min(15.0, fatigue * 25.0),
    }
    risk_score = round(min(100.0, sum(contributions.values())), 2)
    condition = (
        "investigate" if risk_score >= 60 else "review" if risk_score >= 30 else "nominal"
    )
    return {
        "indicators": indicators,
        "risk_contributions": contributions,
        "risk_score": risk_score,
        "condition": condition,
        "interpretation": "Synthetic triage score; not a structural safety determination.",
    }


def compare_scenario(
    observation: BridgeObservation,
    wind_multiplier: float,
    traffic_multiplier: float,
    thermal_offset_c: float,
) -> dict[str, object]:
    base = evaluate(observation)
    changed = observation.model_copy(
        update={
            "wind_speed_ms": min(100.0, observation.wind_speed_ms * wind_multiplier),
            "deck_acceleration_ms2": min(
                25.0,
                observation.deck_acceleration_ms2 * traffic_multiplier,
            ),
            "annual_stress_cycles": min(
                1000000000,
                round(observation.annual_stress_cycles * traffic_multiplier),
            ),
            "deck_temperature_c": max(
                -50.0,
                min(80.0, observation.deck_temperature_c + thermal_offset_c),
            ),
        }
    )
    alternative = evaluate(changed)
    return {
        "baseline": base,
        "scenario": alternative,
        "risk_change": round(alternative["risk_score"] - base["risk_score"], 2),
        "assumption": "Instantaneous independent multipliers without feedback dynamics.",
    }
