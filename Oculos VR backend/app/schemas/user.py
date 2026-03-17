"""Schemas Pydantic usados nas rotas de autenticacao e perfil."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=7)
    full_name: str | None = Field(default=None, max_length=120)
    username: str | None = Field(default=None, max_length=50)


class UserRegisterResponse(BaseModel):
    """Resposta publica devolvida logo apos o cadastro."""

    email: EmailStr
    full_name: str | None = None
    username: str | None = None
    role: str = "user"
    is_active: bool = True


class UserMeResponse(BaseModel):
    """Resposta publica usada pela rota protegida `/users/me`."""

    email: EmailStr
    full_name: str | None = None
    username: str | None = None
    role: str = "user"
    is_active: bool = True
    created_at: datetime | None = None
    updated_at: datetime | None = None


class TokenResponse(BaseModel):
    """Resposta padrao do login para o frontend guardar o token."""

    access_token: str
    token_type: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=7)
