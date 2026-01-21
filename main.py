"""
Application entrypoint for FastAPI.

This exposes `app` for servers like `uvicorn`/`fastapi` to discover,
avoiding "No fastapi entrypoint found" errors.
"""

try:
    # Import when running from project root without modifying PYTHONPATH
    from src.app.api import app  # type: ignore
except ModuleNotFoundError:
    # Fallback when `src` is on PYTHONPATH (e.g., $env:PYTHONPATH="src")
    from app.api import app  # type: ignore


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
