from fastapi import APIRouter
from app.schemas.user import UserCreate
from app.bd.mongo import users_collection  # ou ton DAO si existant
from datetime import datetime
from bson import ObjectId
from app.utils.security import verify_password, hash_password
from app.schemas.user import UserLogin 
router = APIRouter()

@router.post("/users")
async def register_user(user: UserCreate):
    user_dict = user.dict()
    user_dict["created_at"] = datetime.utcnow()
    user_dict["last_login"] = None
    user_dict["password"] = hash_password(user_dict["password"])
    user_dict["preferences"] = {
        "auto_suggestions": True,
        "dark_mode": False,
        "preferred_language": "python",
        "updated_at": datetime.utcnow()
    }
    user_dict["usage_stats"] = {
        "nb_sessions": 0,
        "nb_suggestions_viewed": 0,
        "nb_feedback_given": 0,
        "last_active": None
    }

    result = await users_collection.insert_one(user_dict)
    return {"id": str(result.inserted_id), "message": "User created successfully"}

from bson import ObjectId
#Récupérer un utilisateur par son ID
@router.get("/users/{user_id}")
async def get_user(user_id: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])
        return user
    return {"error": "Utilisateur non trouvé"}

#Changer les préférences (tout ou partiellement)
@router.patch("/users/{user_id}/preferences")
async def update_preferences(user_id: str, prefs: dict):
    update_fields = {f"preferences.{k}": v for k, v in prefs.items()}
    update_fields["preferences.updated_at"] = datetime.utcnow()

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )

    return {"message": "Préférences mises à jour"}

#Modifier le profil utilisateur
@router.patch("/users/{user_id}/profile")
async def update_profile(user_id: str, updates: dict):
    allowed_fields = {"username", "email"}
    update_data = {f: updates[f] for f in updates if f in allowed_fields}

    if not update_data:
        return {"error": "Aucune donnée valide à mettre à jour"}

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    return {"message": "Profil mis à jour"}
#supprimer un utilisateur
@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    await users_collection.delete_one({"_id": ObjectId(user_id)})
    return {"message": "Utilisateur supprimé"}
#modifier le mot de passe

@router.patch("/users/{user_id}/password")
async def update_password(user_id: str, body: dict):
    old_password = body.get("old_password")
    new_password = body.get("new_password")

    if not old_password or not new_password:
        return {"error": "Champs 'old_password' et 'new_password' requis"}

    user = await users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"error": "Utilisateur non trouvé"}

    #  Vérification du mot de passe chiffré
    if not verify_password(old_password, user["password"]):
        return {"error": "Ancien mot de passe incorrect"}

    hashed_new_password = hash_password(new_password)

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": hashed_new_password}}
    )

    return {"message": "Mot de passe mis à jour"}
#login
@router.post("/login")
async def login_user(login_data: UserLogin):
    user = await users_collection.find_one({"email": login_data.email})

    if not user:
        return {"error": "Email incorrect ou utilisateur non trouvé"}

    if not verify_password(login_data.password, user["password"]):
        return {"error": "Mot de passe incorrect"}

    #  Incrémenter nb_sessions et mettre à jour last_active
    await users_collection.update_one(
    {"_id": user["_id"]},
    {
        "$inc": {"usage_stats.nb_sessions": 1},
        "$set": {
            "usage_stats.last_active": datetime.utcnow(),
            "last_login": datetime.utcnow() 
        }
    }
)


    return {
        "message": "Connexion réussie ",
        "user_id": str(user["_id"]),
        "username": user["username"]
    }
#retourner les preférences de l'utilisateur
@router.get("/users/{user_id}/preferences")
async def get_user_preferences(user_id: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {"error": "Utilisateur non trouvé"}
    
    return user["preferences"]
#get nom
@router.get("/users/{user_id}/username")
async def get_username(user_id: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)}, {"username": 1})
    if not user:
        return {"error": "Utilisateur non trouvé"}
    return {"username": user["username"]}
#get email
@router.get("/users/{user_id}/email")
async def get_user_email(user_id: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)}, {"email": 1})
    if not user:
        return {"error": "Utilisateur non trouvé"}
    return {"email": user["email"]}
#get usage stats
@router.get("/users/{user_id}/usage")
async def get_usage_stats(user_id: str):
    user = await users_collection.find_one({"_id": ObjectId(user_id)}, {"usage_stats": 1})
    if not user:
        return {"error": "Utilisateur non trouvé"}
    return user["usage_stats"]
#get all users
@router.get("/allusers")
async def get_all_users():
    cursor = users_collection.find()
    users = []
    async for user in cursor:
        user["_id"] = str(user["_id"])
        users.append(user)
    return users
#get dark mode
@router.get("/users/{user_id}/dark-mode")
async def get_dark_mode(user_id: str):
    user = await users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"preferences.dark_mode": 1}
    )
    if not user or "preferences" not in user:
        return {"error": "Utilisateur ou préférences introuvables"}

    return {"dark_mode": user["preferences"]["dark_mode"]}
