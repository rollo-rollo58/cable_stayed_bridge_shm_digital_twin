"""Environment-driven runtime configuration; no live credentials in source."""
from __future__ import annotations

from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    environment: str
    operator_api_key: str | None
    allowed_origins: tuple[str, ...]


def get_settings() -> Settings:
    return Settings(
        environment=os.getenv("APP_ENV", "development"),
        operator_api_key=os.getenv("OPERATOR_API_KEY"),
        allowed_origins=tuple(
            value.strip()
            for value in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
            if value.strip()
        ),
    )
