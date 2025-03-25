# import os
# import requests
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from dotenv import load_dotenv, find_dotenv
# from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware

# # Load environment variables from .env file
# load_dotenv()

# app = FastAPI()

# # Add CORS middleware to allow cross-origin requests
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # You can restrict this to specific domains if needed
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Request model for incoming messages
# class ChatRequest(BaseModel):
#     message: str

# # Response model for outgoing messages
# class ChatResponse(BaseModel):
#     response: str

# # Hugging Face Inference API configuration from environment variables
# HF_API_TOKEN = os.getenv("HF_API_TOKEN")
# # HF_API_TOKEN = os.getenv("HF_API_TOKEN")
# HF_MODEL_NAME = os.getenv("HF_MODEL_NAME", "distilgpt2")  # Default model is distilgpt2

# def call_huggingface_inference(prompt: str) -> str:
#     """
#     Calls the Hugging Face Inference API to generate a response.
#     """
#     url = f"https://api-inference.huggingface.co/models/{HF_MODEL_NAME}"
#     headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
#     payload = {
#         "inputs": prompt,
#         "parameters": {"max_new_tokens": 50, "temperature": 0.7}
#     }
    
#     response = requests.post(url, headers=headers, json=payload)
    
#     # Debug: Print status code and content of the response
#     print("Hugging Face response status:", response.status_code)
#     print("Response content:", response.text)
    
#     if response.status_code != 200:
#         raise HTTPException(status_code=500, detail=f"Error calling Hugging Face Inference API: {response.text}")
    
#     result = response.json()
    
#     # If the API returns an error message in the JSON, raise an exception with that detail.
#     if isinstance(result, dict) and result.get("error"):
#         raise HTTPException(status_code=500, detail=result["error"])
    
#     # Expected result is a list of generated outputs
#     if isinstance(result, list) and result and "generated_text" in result[0]:
#         return result[0]["generated_text"].strip()
#     else:
#         raise HTTPException(status_code=500, detail="Unexpected response structure from Hugging Face API")

# def escalate_to_human(message: str):
#     """
#     Simulate escalation to a human agent.
#     In a real-world scenario, integrate with a CRM or ticketing system.
#     """
#     print("Escalating query:", message)
#     # Add further integration code as needed

# @app.post("/chat", response_model=ChatResponse)
# def chat_endpoint(chat_request: ChatRequest):
#     user_message = chat_request.message

#     # Check for keywords to trigger escalation
#     if "human" in user_message.lower() or "agent" in user_message.lower():
#         escalate_to_human(user_message)
#         return ChatResponse(response="I am escalating your query to a human agent. Please wait.")

#     try:
#         # Get response from Hugging Face Inference API
#         answer = call_huggingface_inference(user_message)
#     except Exception as e:
#         # Print error for debugging purposes
#         print("Error during inference:", str(e))
#         raise HTTPException(status_code=500, detail=str(e))
#     return ChatResponse(response=answer)

# @app.get("/")
# def read_root():
#     return {"message": "Chatbot API is running."}







import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv, find_dotenv
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware

# Load environment variables from .env file
dotenv_path = find_dotenv()
print("Loading .env file from:", dotenv_path)  # Debug: check .env file path
load_dotenv("/Users/vishesh/Documents/Hackathon/Smart-Customer-Support/chatbot-backend/__pycache__/.env")


app = FastAPI()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific domains if needed
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

# Hugging Face Inference API configuration from environment variables
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL_NAME = os.getenv("HF_MODEL_NAME", "distilgpt2")  # Default model is distilgpt2

# Debug: Check if token is loaded correctly
if not HF_API_TOKEN:
    raise Exception("HF_API_TOKEN not set! Please check your .env file.")
else:
    print("HF_API_TOKEN loaded:", HF_API_TOKEN[:4] + "****")

# def call_huggingface_inference(prompt: str) -> str:
#     """
#     Calls the Hugging Face Inference API to generate a response.
#     """
#     url = f"https://api-inference.huggingface.co/models/{HF_MODEL_NAME}"
#     headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
#     payload = {
#         "inputs": prompt,
#         "parameters": {"max_new_tokens": 50, "temperature": 0.7}
#     }
    
#     response = requests.post(url, headers=headers, json=payload)
    
#     # Debug: Print status code and content of the response
#     print("Hugging Face response status:", response.status_code)
#     print("Response content:", response.text)
    
#     if response.status_code != 200:
#         raise HTTPException(status_code=500, detail=f"Error calling Hugging Face Inference API: {response.text}")
    
#     result = response.json()
    
#     # If the API returns an error message in the JSON, raise an exception with that detail.
#     if isinstance(result, dict) and result.get("error"):
#         raise HTTPException(status_code=500, detail=result["error"])
    
#     # Expected result is a list of generated outputs
#     if isinstance(result, list) and result and "generated_text" in result[0]:
#         return result[0]["generated_text"].strip()
#     else:
#         raise HTTPException(status_code=500, detail="Unexpected response structure from Hugging Face API")



def call_huggingface_inference(prompt: str) -> str:
    """
    Calls the Hugging Face Inference API to generate a response.
    """
    # Add conversation context if desired
    full_prompt = f"User: {prompt}\nBot:"
    
    url = f"https://api-inference.huggingface.co/models/{HF_MODEL_NAME}"
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {
        "inputs": full_prompt,
        "parameters": {
            "max_new_tokens": 150,
            "temperature": 0.9,
            "top_p": 0.95,
            "top_k": 50
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    # Debug: Print status code and content of the response
    print("Hugging Face response status:", response.status_code)
    print("Response content:", response.text)
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Error calling Hugging Face Inference API: {response.text}")
    
    result = response.json()
    
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])
    
    if isinstance(result, list) and result and "generated_text" in result[0]:
        # Optionally, remove the prompt from the generated text
        generated_text = result[0]["generated_text"].strip()
        # Remove the leading context (if it repeats "User:" etc.)
        if generated_text.startswith("User:"):
            generated_text = generated_text.split("Bot:")[-1].strip()
        return generated_text
    else:
        raise HTTPException(status_code=500, detail="Unexpected response structure from Hugging Face API")




def escalate_to_human(message: str):
    """
    Simulate escalation to a human agent.
    In a real-world scenario, integrate with a CRM or ticketing system.
    """
    print("Escalating query:", message)
    # Add further integration code as needed

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(chat_request: ChatRequest):
    user_message = chat_request.message

    # Check for keywords to trigger escalation
    if "human" in user_message.lower() or "agent" in user_message.lower():
        escalate_to_human(user_message)
        return ChatResponse(response="I am escalating your query to a human agent. Please wait.")

    try:
        # Get response from Hugging Face Inference API
        answer = call_huggingface_inference(user_message)
    except Exception as e:
        # Print error for debugging purposes
        print("Error during inference:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    return ChatResponse(response=answer)

@app.get("/")
def read_root():
    return {"message": "Chatbot API is running."}
