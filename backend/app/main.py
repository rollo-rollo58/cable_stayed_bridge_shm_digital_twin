"""FastAPI application factory and readiness endpoints."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routes import router


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Bridge Structural Health Research",
        version="1.0.0",
        description="Synthetic structural health workbench; not for operational safety use.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.allowed_origins),
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "X-Operator-Key"],
    )
    app.include_router(router)

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok", "mode": "synthetic", "version": "1.0.0"}

    return app


app = create_app()
