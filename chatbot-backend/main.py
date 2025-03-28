

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router as chat_router
from login import router as login_router
from journal import router as journal_router

app = FastAPI()

# ✅ Correct CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (use "*" for development only)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include Routers
app.include_router(chat_router)
app.include_router(login_router)
app.include_router(journal_router)
