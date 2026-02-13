from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
