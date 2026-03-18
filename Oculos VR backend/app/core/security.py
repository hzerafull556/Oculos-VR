"""Funcoes basicas de seguranca usadas no fluxo de autenticacao."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# O passlib centraliza a estrategia de hash e verificacao para o restante da app.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Recebe a senha pura e devolve a senha protegida em hash."""

    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """Compara a senha digitada com o hash salvo no banco."""

    return pwd_context.verify(password, hashed_password)


def create_access_token(
    subject: str,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    """Cria um JWT usando as configuracoes carregadas do `.env`."""

    # O token expira conforme a configuracao central do projeto.
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expire,
    }

    if extra_claims:
        payload.update(extra_claims)

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """Decodifica o JWT e devolve os dados do usuario autenticado."""

    # Se o token estiver invalido ou expirado, a biblioteca levanta JWTError.
    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )
