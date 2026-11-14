"""Strict request and response contracts for research engineering analyses."""
from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class BridgeObservation(BaseModel):
    model_config = ConfigDict(extra="forbid")
    modal_frequency_hz: float = Field(gt=0.0, lt=50.0)
    modal_baseline_hz: float = Field(gt=0.0, lt=50.0)
    deck_acceleration_ms2: float = Field(ge=0.0, le=25.0)
    wind_speed_ms: float = Field(ge=0.0, le=100.0)
    deck_temperature_c: float = Field(ge=-50.0, le=80.0)
    baseline_temperature_c: float = Field(ge=-50.0, le=80.0)
    longitudinal_strain_micro: float = Field(ge=-5000.0, le=5000.0)
    annual_stress_cycles: int = Field(ge=0, le=1000000000)
    stress_range_mpa: float = Field(ge=0.0, le=1500.0)


class ScenarioRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    baseline: BridgeObservation
    wind_multiplier: float = Field(ge=0.0, le=4.0)
    traffic_multiplier: float = Field(ge=0.0, le=4.0)
    thermal_offset_c: float = Field(ge=-35.0, le=35.0)


class IngestionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    sensor_code: str = Field(min_length=3, max_length=48, pattern=r"^[A-Z0-9_-]+$")
    value: float = Field(ge=-100000.0, le=100000.0)
    unit: str = Field(min_length=1, max_length=16)


class PolicyInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    observed: float = Field(ge=-1000000.0, le=1000000.0)
    reference: float = Field(gt=0.0, le=1000000.0)
    variability: float = Field(ge=0.0, le=100.0)
    exposure: float = Field(ge=0.0, le=100000.0)
