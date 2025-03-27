from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()
router = APIRouter()

# Azure OpenAI setup
token = os.getenv("GITHUB_TOKEN")
client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=token,
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    tone: Optional[str] = "friendly"

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
def chat(chat_request: ChatRequest):
    try:
        print("📨 Chat received:", chat_request.messages[-1].content)

        response = client.chat.completions.create(
            messages=chat_request.messages,
            temperature=1.0,
            top_p=1.0,
            max_tokens=500,
            model="gpt-4o"
        )

        reply = response.choices[0].message.content
        print("🤖 OpenAI reply:", reply)
        return ChatResponse(response=reply)

    except Exception as e:
        print("❌ Azure OpenAI API error:", e)
        return ChatResponse(response="Sorry, I couldn't connect to my AI brain right now.")
