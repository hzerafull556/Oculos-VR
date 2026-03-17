from __future__ import annotations

from datetime import datetime, timezone

from app.core.security import create_access_token, hash_password
from app.repositories.user_repository import UserRepository


def test_register_success(client, monkeypatch) -> None:
    """O cadastro deve funcionar quando o email ainda nao existe."""

    async def fake_find_by_email(self: UserRepository, email: str):
        return None

    async def fake_create_user(self: UserRepository, user_data: dict):
        return {"inserted_id": "fake-id"}

    monkeypatch.setattr(UserRepository, "find_by_email", fake_find_by_email)
    monkeypatch.setattr(UserRepository, "create_user", fake_create_user)

    response = client.post(
        "/auth/register",
        json={
            "email": "new-user@example.com",
            "password": "1234567",
            "full_name": "New User",
            "username": "newuser",
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "email": "new-user@example.com",
        "full_name": "New User",
        "username": "newuser",
        "role": "user",
        "is_active": True,
    }


def test_register_duplicate_email_returns_400(client, monkeypatch) -> None:
    """Se o email ja existir, a rota deve devolver 400."""

    async def fake_find_by_email(self: UserRepository, email: str):
        return {"email": email}

    monkeypatch.setattr(UserRepository, "find_by_email", fake_find_by_email)

    response = client.post(
        "/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "1234567",
        },
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": "Ja existe um usuario com este email.",
    }


def test_login_success_returns_token(client, monkeypatch) -> None:
    """O login deve devolver um Bearer token quando a senha estiver correta."""

    async def fake_find_by_email(self: UserRepository, email: str):
        return {
            "email": email,
            "hashed_password": hash_password("1234567"),
            "role": "user",
        }

    monkeypatch.setattr(UserRepository, "find_by_email", fake_find_by_email)

    response = client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "1234567",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert isinstance(body["access_token"], str)
    assert body["access_token"]


def test_login_invalid_password_returns_401(client, monkeypatch) -> None:
    """Senha incorreta deve devolver 401."""

    async def fake_find_by_email(self: UserRepository, email: str):
        return {
            "email": email,
            "hashed_password": hash_password("1234567"),
            "role": "user",
        }

    monkeypatch.setattr(UserRepository, "find_by_email", fake_find_by_email)

    response = client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "wrong999",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Email ou senha invalidos.",
    }


def test_register_returns_503_when_database_fails(client, monkeypatch) -> None:
    """Falha de banco no cadastro deve virar 503 controlado."""

    async def fake_find_by_email(self: UserRepository, email: str):
        raise ConnectionError("Falha ao buscar usuario no MongoDB.")

    monkeypatch.setattr(UserRepository, "find_by_email", fake_find_by_email)

    response = client.post(
        "/auth/register",
        json={
            "email": "db-down@example.com",
            "password": "1234567",
        },
    )

    assert response.status_code == 503
    assert "Banco de dados indisponivel." in response.json()["detail"]


def test_login_returns_503_when_database_fails(client, monkeypatch) -> None:
    """Falha de banco no login deve virar 503 controlado."""

    async def fake_find_by_email(self: UserRepository, email: str):
        raise ConnectionError("Falha ao buscar usuario no MongoDB.")

    monkeypatch.setattr(UserRepository, "find_by_email", fake_find_by_email)

    response = client.post(
        "/auth/login",
        json={
            "email": "db-down@example.com",
            "password": "1234567",
        },
    )

    assert response.status_code == 503
    assert "Banco de dados indisponivel." in response.json()["detail"]


def test_users_me_success(client, monkeypatch) -> None:
    """Token valido deve permitir acessar o perfil atual."""

    async def fake_find_by_email(self: UserRepository, email: str):
        now = datetime.now(timezone.utc)
        return {
            "email": email,
            "full_name": "Current User",
            "username": "currentuser",
            "role": "user",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }

    monkeypatch.setattr(UserRepository, "find_by_email", fake_find_by_email)
    token = create_access_token("me@example.com", extra_claims={"role": "user"})

    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "me@example.com"
    assert body["username"] == "currentuser"
    assert body["role"] == "user"
    assert body["is_active"] is True
    assert body["created_at"]
    assert body["updated_at"]


def test_users_me_without_token_returns_401(client) -> None:
    """Sem token, a API deve responder 401 de forma explicita."""

    response = client.get("/users/me")

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Token nao informado.",
    }


def test_users_me_with_invalid_token_returns_401(client) -> None:
    """Token invalido deve ser recusado pela dependencia."""

    response = client.get(
        "/users/me",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Token invalido ou expirado.",
    }


def test_users_me_returns_503_when_database_fails(client, monkeypatch) -> None:
    """Mesmo com token valido, falha no banco deve virar 503."""

    async def fake_find_by_email(self: UserRepository, email: str):
        raise ConnectionError("Falha ao buscar usuario no MongoDB.")

    monkeypatch.setattr(UserRepository, "find_by_email", fake_find_by_email)
    token = create_access_token("me@example.com", extra_claims={"role": "user"})

    response = client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 503
    assert "Banco de dados indisponivel." in response.json()["detail"]
