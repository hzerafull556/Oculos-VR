"""Modelo interno de usuario para uso futuro em services e repositories."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass(slots=True)
class UserModel:
    email: str
    hashed_password: str
    full_name: str | None = None
    username: str | None = None
    role: str = "user"
    is_active: bool = True
    created_at: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    def to_mongo(self) -> dict[str, Any]:
        return asdict(self)
