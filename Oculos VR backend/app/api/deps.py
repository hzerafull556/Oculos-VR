from __future__ import annotations

from typing import Any

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError

from app.core.config import settings
from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService

# Com auto_error=False, nos mesmos decidimos a mensagem 401 da API.
security = HTTPBearer(auto_error=False)


def get_user_service(request: Request) -> UserService:
    """Monta o service de usuario usando o banco salvo no estado da app."""

    database = request.app.state.mongo_manager.database
    repository = UserRepository(database)
    return UserService(repository)


def build_database_http_exception(exc: Exception) -> HTTPException:
    """Padroniza a resposta 503 quando o MongoDB nao estiver disponivel."""

    detail = "Banco de dados indisponivel."
    if settings.app_debug:
        detail = f"{detail} Detalhe: {exc}"

    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail=detail,
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    service: UserService = Depends(get_user_service),
) -> dict[str, Any]:
    """Valida o token e devolve o usuario atual vindo do banco."""

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token nao informado.",
        )

    token = credentials.credentials

    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalido ou expirado.",
        ) from exc

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalido.",
        )

    try:
        # Aqui buscamos o usuario real no banco para nao confiar apenas no token.
        user = await service.user_repository.find_by_email(email)
    except ConnectionError as exc:
        raise build_database_http_exception(exc) from exc

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario nao encontrado.",
        )

    return user
