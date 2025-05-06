from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Feedback(BaseModel):
    id: str
    user_id: str
    rating: int
    comment: Optional[str]
    created_at: datetime
