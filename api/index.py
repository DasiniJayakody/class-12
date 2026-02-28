import sys
from pathlib import Path

# Add the root directory to sys.path so we can import from src
root_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(root_dir))

# Import the FastAPI app
from src.app.api import app
