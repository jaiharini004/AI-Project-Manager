from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Project Manager"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./test.db"
    
    # Security
    SECRET_KEY: str = "change_this_in_production_secret_key_123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI
    GROQ_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
