from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os

# Tu peux remplacer cette URI par une variable d’environnement en prod
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "code_suggestion_db"

client = AsyncIOMotorClient(MONGO_URI, server_api=ServerApi("1"))
db = client[DB_NAME]

# ✅ Collections
users_collection = db["users"]
sessions_collection = db["sessions"]
feedback_collection = db["feedback"]

# Optionnel si tu veux centraliser toutes les collections
def get_db():
    return {
        "users": users_collection,
        "sessions": sessions_collection,
        "feedback": feedback_collection
    }
