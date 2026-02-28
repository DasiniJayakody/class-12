import os
import sys

# Ensure the project root is in the path
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root not in sys.path:
    sys.path.insert(0, root)

# Also check for functions/
functions_root = os.path.join(root, "functions")
if os.path.exists(functions_root) and functions_root not in sys.path:
    sys.path.append(functions_root)

# Import the app
from src.app.api import app

# This allows Vercel to find the FastAPI instance
# Vercel's Python runtime will look for 'app' in this file
