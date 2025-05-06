from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Preferences(BaseModel):
    auto_suggestions: bool
    dark_mode: bool
    preferred_language: str
    updated_at: datetime

class UsageStats(BaseModel):
    nb_sessions: int
    nb_suggestions_viewed: int
    nb_feedback_given: int
    last_active: datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    created_at: datetime
    last_login: Optional[datetime]
    preferences: Preferences
    usage_stats: UsageStats
