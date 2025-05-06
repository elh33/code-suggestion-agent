from fastapi import APIRouter, Body, Query
from app.bd.mongo import feedback_collection, users_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/feedback")
async def submit_feedback(feedback: dict = Body(...)):
    user_id = feedback.get("user_id")
    rating = feedback.get("rating")
    comment = feedback.get("comment", "")

    if not user_id or not rating:
        return {"error": "Champs 'user_id' et 'rating' sont requis"}

    feedback_doc = {
        "user_id": user_id,
        "rating": rating,
        "comment": comment,
        "created_at": datetime.utcnow()
    }

    # Insérer le feedback
    result = await feedback_collection.insert_one(feedback_doc)

    # Incrémenter nb_feedback_given
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$inc": {"usage_stats.nb_feedback_given": 1}
        }
    )

    return {"message": "Feedback enregistré", "id": str(result.inserted_id)}
#get last feedback
@router.get("/{user_id}/feedback")
async def get_user_last_feedback(user_id: str):
    feedback = await feedback_collection.find_one(
        {"user_id": user_id},
        sort=[("created_at", -1)]  # Tri décroissant = dernier en premier
    )

    if not feedback:
        return {"message": "Aucun feedback trouvé pour cet utilisateur"}

    return {
        "rating": feedback["rating"],
        "comment": feedback.get("comment", ""),
        "created_at": feedback["created_at"]
    }
#get all feedback of a user
@router.get("/{user_id}/feedbacks")
async def get_all_feedbacks_by_user(user_id: str):
    cursor = feedback_collection.find({"user_id": user_id}).sort("created_at", -1)
    feedbacks = []
    async for fb in cursor:
        feedbacks.append({
            "rating": fb["rating"],
            "comment": fb.get("comment", ""),
            "created_at": fb["created_at"]
        })
    return feedbacks
#get all feedbacks
@router.get("/feedbacks")
async def get_all_feedbacks():
    cursor = feedback_collection.find().sort("created_at", -1)
    feedbacks = []
    async for fb in cursor:
        feedbacks.append({
            "user_id": fb["user_id"],
            "rating": fb["rating"],
            "comment": fb.get("comment", ""),
            "created_at": fb["created_at"]
        })
    return feedbacks
#get last rating of a user
@router.get("/{user_id}/feedback/rating")
async def get_last_rating_by_user(user_id: str):
    feedback = await feedback_collection.find_one(
        {"user_id": user_id},
        sort=[("created_at", -1)]
    )

    if not feedback:
        return {"message": "Aucun feedback trouvé"}

    return {"rating": feedback["rating"]}
