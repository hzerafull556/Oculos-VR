"""Repository responsavel por conversar com a collection `users`."""

from __future__ import annotations

from typing import Any

from pymongo.errors import PyMongoError


class UserRepository:
    def __init__(self, database: Any | None) -> None:
        self.database = database

    @property
    def collection(self) -> Any | None:
        if self.database is None:
            return None
        return self.database["users"]

    def _require_collection(self) -> Any:
        """Garante que existe uma collection pronta antes de consultar."""

        if self.collection is None:
            raise ConnectionError("A conexao com o MongoDB nao esta disponivel.")
        return self.collection

    async def find_by_email(self, email: str) -> dict[str, Any] | None:
        """Busca um usuario pelo email."""

        try:
            return await self._require_collection().find_one({"email": email})
        except PyMongoError as exc:
            raise ConnectionError("Falha ao buscar usuario no MongoDB.") from exc

    async def create_user(self, user_data: dict[str, Any]) -> Any:
        """Insere um novo usuario na collection."""

        try:
            return await self._require_collection().insert_one(user_data)
        except PyMongoError as exc:
            raise ConnectionError("Falha ao criar usuario no MongoDB.") from exc
