from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3

router = APIRouter()

# Database connection
conn = sqlite3.connect("journal.db", check_same_thread=False)
cursor = conn.cursor()

# Create journal table if it does not exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS journal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")
conn.commit()

# Journal Entry Model
class JournalEntry(BaseModel):
    content: str

@router.get("/journal")
def get_journal_entries():
    print("✅ Journal endpoint accessed")
    cursor.execute("SELECT content, timestamp FROM journal ORDER BY timestamp DESC")
    entries = [{"content": row[0], "timestamp": row[1]} for row in cursor.fetchall()]
    return {"entries": entries}


@router.post("/journal")
def add_journal_entry(entry: JournalEntry):
    cursor.execute("INSERT INTO journal (content) VALUES (?)", (entry.content,))
    conn.commit()
    return {"message": "Journal entry added successfully!"}
