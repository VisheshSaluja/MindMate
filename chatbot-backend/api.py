# from fastapi import APIRouter
# from pydantic import BaseModel
# from typing import List, Optional
# from dotenv import load_dotenv
# from openai import OpenAI
# import os

# load_dotenv()
# router = APIRouter()

# # Azure OpenAI setup
# token = os.getenv("GITHUB_TOKEN")
# client = OpenAI(
#     base_url="https://models.inference.ai.azure.com",
#     api_key=token,
# )

# class Message(BaseModel):
#     role: str
#     content: str

# class ChatRequest(BaseModel):
#     messages: List[Message]
#     tone: Optional[str] = "friendly"

# class ChatResponse(BaseModel):
#     response: str

# @router.post("/chat", response_model=ChatResponse)
# def chat(chat_request: ChatRequest):
#     try:
#         print("📨 Chat received:", chat_request.messages[-1].content)

#         response = client.chat.completions.create(
#             messages=chat_request.messages,
#             temperature=1.0,
#             top_p=1.0,
#             max_tokens=500,
#             model="gpt-4o"
#         )

#         reply = response.choices[0].message.content
#         print("🤖 OpenAI reply:", reply)
#         return ChatResponse(response=reply)

#     except Exception as e:
#         print("❌ Azure OpenAI API error:", e)
#         return ChatResponse(response="Sorry, I couldn't connect to my AI brain right now.")




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

# Models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    tone: Optional[str] = "friendly"
    mood: Optional[str] = "neutral"  # New: Track mood
    assessment_score: Optional[int] = 0  # New: Track assessment score

class ChatResponse(BaseModel):
    response: str
    mood: str
    assessment_trigger: bool

# Mood detection logic
def analyze_mood(messages):
    latest_message = messages[-1].content.lower()
    mood = "neutral"

    if any(word in latest_message for word in ["happy", "excited", "great", "good", "awesome"]):
        mood = "happy"
    elif any(word in latest_message for word in ["sad", "down", "lonely", "depressed", "bad"]):
        mood = "sad"
    elif any(word in latest_message for word in ["angry", "upset", "frustrated", "mad"]):
        mood = "angry"

    return mood

# Self-assessment trigger logic
def should_trigger_assessment(messages):
    return len([msg for msg in messages if msg.role == "user"]) >= 5

@router.post("/chat", response_model=ChatResponse)
def chat(chat_request: ChatRequest):
    try:
        # Analyze mood
        mood = analyze_mood(chat_request.messages)
        print(f"💡 Detected Mood: {mood}")

        # Trigger self-assessment after 5 messages
        assessment_trigger = should_trigger_assessment(chat_request.messages)
        
        # Adjust tone based on mood
        if mood == "happy":
            tone = "positive and encouraging"
        elif mood == "sad":
            tone = "compassionate and supportive"
        elif mood == "angry":
            tone = "calm and understanding"
        else:
            tone = chat_request.tone

        # Send messages to OpenAI
        response = client.chat.completions.create(
            messages=chat_request.messages,
            temperature=0.9 if mood == "angry" else 1.0,
            top_p=1.0,
            max_tokens=500,
            model="gpt-4o"
        )

        reply = response.choices[0].message.content
        print("🤖 OpenAI reply:", reply)

        return ChatResponse(response=reply, mood=mood, assessment_trigger=assessment_trigger)

    except Exception as e:
        print("❌ Azure OpenAI API error:", e)
        return ChatResponse(response="Sorry, I couldn't connect to my AI brain right now.", mood="neutral", assessment_trigger=False)


@router.post("/followup")
def generate_followup(chat_request: ChatRequest):
    try:
        mood = chat_request.mood
        print(f"🎯 Generating follow-up questions for mood: {mood}")

        # Ask OpenAI to suggest follow-up questions based on mood
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a mental health assistant. Based on the user's mood, generate 3 personalized follow-up questions to engage the user."},
                {"role": "user", "content": f"The user feels {mood}. What follow-up questions should I ask?"}
            ],
            temperature=0.8,
            max_tokens=500,
            model="gpt-4o"
        )

        followup_questions = response.choices[0].message.content.strip().split("\n")
        print(f"✅ Generated follow-up questions: {followup_questions}")

        return {"questions": followup_questions[:3]}
    except Exception as e:
        print("❌ OpenAI API error for follow-up:", e)
        return {"questions": ["Sorry, I’m unable to generate questions at this time."]}
