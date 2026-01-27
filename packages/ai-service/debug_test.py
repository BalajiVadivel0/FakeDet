import sys
import os
sys.path.append(os.getcwd())
print("Current CWD:", os.getcwd())
print("Python Path:", sys.path)

try:
    from src.model_handler import ModelHandler
    print("SUCCESS: Imported ModelHandler")
except Exception as e:
    print(f"ERROR: Failed to import ModelHandler: {e}")

try:
    from app import app
    print("SUCCESS: Imported app")
except Exception as e:
    print(f"ERROR: Failed to import app: {e}")
