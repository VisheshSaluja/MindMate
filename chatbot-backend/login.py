from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
import sqlite3

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# DB connection
conn = sqlite3.connect("users.db", check_same_thread=False)
cursor = conn.cursor()

# Create table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    hashed_password TEXT
)
""")
conn.commit()

# Shared model
class LoginInput(BaseModel):
    email: str
    password: str

# 🔐 LOGIN ROUTE
@router.post("/login")
def login(data: LoginInput):
    cursor.execute("SELECT hashed_password FROM users WHERE email=?", (data.email,))
    user = cursor.fetchone()

    if not user or not pwd_context.verify(data.password, user[0]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"token": "valid-token-for-now"}

# 📝 REGISTER ROUTE
@router.post("/register")
def register(data: LoginInput):
    hashed_pw = pwd_context.hash(data.password)
    try:
        cursor.execute(
            "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
            (data.email, hashed_pw)
        )
        conn.commit()
        return {"token": "valid-token-for-now"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")
