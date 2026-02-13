from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ChatRequest, ChatResponse
from app.openai_client import client
from app.prompts import AARYA_SYSTEM_PROMPT

app = FastAPI(title="Aarya Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store (MVP)
SESSIONS = {}

@app.get("/")
def root():
    return {"status": "Aarya backend running"}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):

    # Create session if it doesn't exist
    if req.session_id not in SESSIONS:
        SESSIONS[req.session_id] = [
            {"role": "system", "content": AARYA_SYSTEM_PROMPT}
        ]

    # Add user message
    SESSIONS[req.session_id].append(
        {"role": "user", "content": req.message}
    )

    # Send full conversation
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=SESSIONS[req.session_id],
        temperature=0.4,
        max_tokens=350
    )

    reply = response.choices[0].message.content.strip()

    # Store assistant reply
    SESSIONS[req.session_id].append(
        {"role": "assistant", "content": reply}
    )

    return ChatResponse(reply=reply)
