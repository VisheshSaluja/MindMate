import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Request model for incoming messages
class ChatRequest(BaseModel):
    message: str

# Response model for outgoing messages
class ChatResponse(BaseModel):
    response: str


@app.get("/")
def read_root():
    return {"message": "Chatbot API is running."}

@app.post("/chat", response_model=ChatResponse)
def chat(chat_request: ChatRequest):
    user_message = chat_request.message
    print("Received:", user_message)

    # FAQ data
    faq_data = {
        "return policy": "Our return policy is 30 days.",
        "delivery time": "Orders are typically delivered in 3-5 days.",
        "support hours": "We’re available Mon–Fri, 9am to 6pm."
    }

    # Check if the user message matches any FAQ keyword
    for keyword, answer in faq_data.items():
        if keyword in user_message.lower():
            return ChatResponse(response=answer)

    # TEMP: Echo the input
    return ChatResponse(response=f"You said: {user_message}")

class EscalateRequest(BaseModel):
    message: str

@app.post("/escalate")
def escalate_chat(escalate_request: EscalateRequest):
    message = escalate_request.message
    print("🚨 Escalated to human:", message)
    return {"status": "Escalated", "message": message}