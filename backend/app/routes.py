"""Small versioned REST surface with strict Pydantic validation."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse

from .analytics import compare_scenario, evaluate
from .ingest import dashboard_snapshot, inspection_ledger, sensor_map
from .schemas import BridgeObservation, IngestionRequest, PolicyInput, ScenarioRequest
from .security import require_operator
from .store import observation_log
from .stream import synthetic_events


router = APIRouter(prefix="/api/v1")


@router.get("/overview")
async def overview() -> dict[str, object]:
    return dashboard_snapshot()


@router.get("/sensors")
async def sensors() -> list[dict[str, object]]:
    return sensor_map()


@router.get("/inspections")
async def inspections() -> list[dict[str, str]]:
    return inspection_ledger()


@router.post("/analyze")
async def analyze(payload: BridgeObservation) -> dict[str, object]:
    return evaluate(payload)


@router.post("/scenarios")
async def scenarios(payload: ScenarioRequest) -> dict[str, object]:
    return compare_scenario(
        payload.baseline,
        payload.wind_multiplier,
        payload.traffic_multiplier,
        payload.thermal_offset_c,
    )


@router.post("/ingest", dependencies=[Depends(require_operator)])
async def ingest(payload: IngestionRequest) -> dict[str, object]:
    return observation_log.append(payload.sensor_code, payload.value, payload.unit)


@router.get("/events")
async def events(limit: int = Query(default=30, ge=1, le=100)) -> list[dict[str, object]]:
    return observation_log.latest(limit)


@router.get("/stream")
async def stream() -> StreamingResponse:
    return StreamingResponse(
        synthetic_events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"},
    )


@router.post("/policies/{category}/{number}")
async def evaluate_policy(
    category: str,
    number: int,
    payload: PolicyInput,
) -> dict[str, float | str]:
    valid = ("modal", "strain", "cables", "wind", "thermal", "fatigue")
    if category not in valid or not 0 <= number < 1000:
        raise HTTPException(status_code=404, detail="Policy rule not found")
    from importlib import import_module

    module = import_module(f"app.catalog.{category}")
    policy = getattr(module, f"evaluate_{category}_case_{number:04d}")
    return policy(
        payload.observed,
        payload.reference,
        payload.variability,
        payload.exposure,
    )
