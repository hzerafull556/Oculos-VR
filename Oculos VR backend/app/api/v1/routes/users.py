from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.user import UserMeResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserMeResponse)
async def read_me(current_user=Depends(get_current_user)):
    """Devolve apenas os campos publicos do usuario autenticado."""

    # Montamos a resposta manualmente para nunca expor o hash da senha.
    return {
        "email": current_user["email"],
        "full_name": current_user.get("full_name"),
        "username": current_user.get("username"),
        "role": current_user.get("role"),
        "is_active": current_user.get("is_active"),
        "created_at": current_user.get("created_at"),
        "updated_at": current_user.get("updated_at"),
    }
