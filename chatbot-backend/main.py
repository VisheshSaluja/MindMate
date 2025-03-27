import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# FastAPI setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# Azure OpenAI setup
token = os.getenv("GITHUB_TOKEN")
client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=token,
)

@app.post("/chat", response_model=ChatResponse)
def chat(chat_request: ChatRequest):
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": chat_request.message}
            ],
            temperature=1.0,
            top_p=1.0,
            max_tokens=500,
            model="gpt-4o"  # or "gpt-4"
        )
        return ChatResponse(response=response.choices[0].message.content)
    except Exception as e:
        print("❌ Azure OpenAI API error:", e)
        return ChatResponse(response="Sorry, I couldn't connect to my AI brain right now.")
