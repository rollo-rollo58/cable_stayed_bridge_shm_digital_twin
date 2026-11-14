"""Fail-closed operator-key authentication for mutation endpoints."""
from __future__ import annotations

import hmac

from fastapi import Header, HTTPException

from .config import get_settings


async def require_operator(x_operator_key: str | None = Header(default=None)) -> str:
    configured = get_settings().operator_api_key
    if not configured:
        raise HTTPException(status_code=503, detail="Operator ingestion disabled")
    if not x_operator_key or not hmac.compare_digest(x_operator_key, configured):
        raise HTTPException(status_code=401, detail="Invalid operator credentials")
    return "operator"
