import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directories
ROOT_DIR = Path(__file__).parent.parent
DATA_DIR = os.getenv("DATA_DIR", ROOT_DIR / "data")
CACHE_DIR = os.getenv("HF_HOME", "D:/huggingface_cache")

# Model settings
MODEL_NAME = os.getenv("MODEL_NAME", "microsoft/phi-2")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
DEVICE = os.getenv("DEVICE", "cpu")  # 'cpu' or 'cuda'
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))

# Vector store settings
VECTORSTORE_DIR = os.getenv("VECTORSTORE_DIR", DATA_DIR / "vectorstore")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "code_suggestions")

# Service settings
HOST = os.getenv("HOST", "localhost")
PORT = int(os.getenv("PORT", "8000"))
WEBSOCKET_PATH = os.getenv("WEBSOCKET_PATH", "/ws")