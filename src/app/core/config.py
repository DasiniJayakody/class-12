"""Configuration management for the multi-agent RAG system.

This module uses Pydantic Settings to load and validate environment variables
for OpenAI models, Pinecone settings, and other system parameters.
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # OpenAI Configuration (required)
    openai_api_key: Optional[str] = None
    openai_model_name: str = "gpt-4o-mini"
    openai_embedding_model_name: str = "text-embedding-3-large"

    # Pinecone Configuration (required)
    pinecone_api_key: Optional[str] = None
    pinecone_index_name: Optional[str] = None

    # Retrieval Configuration
    retrieval_k: int = 4

    # Server Configuration
    port: int = 8000
    host: str = "0.0.0.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    def validate_credentials(self) -> None:
        """Validate that required credentials are set.

        Raises:
            ValueError: If required credentials are missing.
        """
        missing = []
        if not self.openai_api_key:
            missing.append("OPENAI_API_KEY")
        if not self.pinecone_api_key:
            missing.append("PINECONE_API_KEY")
        if not self.pinecone_index_name:
            missing.append("PINECONE_INDEX_NAME")

        if missing:
            raise ValueError(
                f"Missing required credentials: {', '.join(missing)}. "
                "Set these in .env or environment variables."
            )


# Create a singleton settings instance
_settings: Settings | None = None
_credentials_validated: bool = False


def get_settings() -> Settings:
    """Get the application settings instance (singleton pattern).

    Returns:
        Settings instance with all configuration values loaded.

    Raises:
        ValueError: If required credentials are not set when first accessed.
    """
    global _settings, _credentials_validated
    if _settings is None:
        _settings = Settings()

    # Validate credentials on first actual use (lazy validation)
    if not _credentials_validated:
        _settings.validate_credentials()
        _credentials_validated = True

    return _settings
