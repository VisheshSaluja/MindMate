# main.py
import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Define request model
class ChatRequest(BaseModel):
    message: str

# Define response model
class ChatResponse(BaseModel):
    response: str

# Azure OpenAI configuration from environment variables
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")  # e.g., https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT")  # e.g., text-davinci-003

def call_azure_openai(prompt: str) -> str:
    """Call the Azure OpenAI service to get a completion."""
    url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{DEPLOYMENT_NAME}/completions?api-version=2022-12-01"
    headers = {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_API_KEY
    }
    data = {
        "prompt": prompt,
        "max_tokens": 150,
        "temperature": 0.7,
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error calling Azure OpenAI service")
    result = response.json()
    # Extract text from the first completion result
    return result["choices"][0]["text"].strip()

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(chat_request: ChatRequest):
    user_message = chat_request.message

    # Simple logic: if the message contains a keyword, escalate to human support
    if "human" in user_message.lower() or "agent" in user_message.lower():
        # Here you might integrate with a CRM/ticketing system
        # For now, we simply simulate escalation.
        escalate_to_human(user_message)
        return ChatResponse(response="I am escalating your query to a human agent. Please wait.")

    try:
        # Get response from Azure OpenAI
        answer = call_azure_openai(user_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return ChatResponse(response=answer)

def escalate_to_human(message: str):
    """
    Dummy function to simulate escalation.
    Here you could integrate with systems like Zendesk, Freshdesk, or Azure Logic Apps.
    """
    print("Escalating query:", message)
    # For example, you could send an email or post to a webhook here.

@app.get("/")
def read_root():
    return {"message": "Chatbot API is running."}
