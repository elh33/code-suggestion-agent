from pydantic import BaseModel
from typing import List, Optional

class CodeSuggestion(BaseModel):
    id: str
    suggestion: str
    score: float

class UserInput(BaseModel):
    code: str
    context: Optional[str] = None

class ResponseModel(BaseModel):
    suggestions: List[CodeSuggestion]
    user_input: UserInput