"""Regras de negocio do fluxo de usuario e autenticacao."""

from __future__ import annotations

from typing import Any

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import UserModel
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserLogin


class UserService:
    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    async def is_ready(self) -> bool:
        return self.user_repository.collection is not None

    async def register_user(self, payload: UserCreate) -> dict[str, Any]:
        """Registra um usuario novo e devolve os dados publicos dele."""

        existing_user = await self.user_repository.find_by_email(payload.email)
        if existing_user:
            raise ValueError("Ja existe um usuario com este email.")

        # O model interno guarda exatamente os campos que vao para o MongoDB.
        user = UserModel(
            email=payload.email,
            hashed_password=hash_password(payload.password),
            full_name=payload.full_name,
            username=payload.username,
            role="user",
        )

        await self.user_repository.create_user(user.to_mongo())

        return {
            "email": user.email,
            "full_name": user.full_name,
            "username": user.username,
            "role": user.role,
            "is_active": user.is_active,
        }

    async def login_user(self, payload: UserLogin) -> dict[str, str]:
        """Valida email e senha e devolve o token Bearer."""

        user = await self.user_repository.find_by_email(payload.email)
        if not user:
            raise ValueError("Email ou senha invalidos.")

        if not verify_password(payload.password, user["hashed_password"]):
            raise ValueError("Email ou senha invalidos.")

        token = create_access_token(
            subject=user["email"],
            extra_claims={"role": user.get("role", "user")},
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }
