# MindMate


## How to Run the App

### 🟢 Start the Backend

## How to Run the Backend

1. **Navigate to backend**
    
    ```bash
    cd chatbot-backend
    ```
    
2. **Create a virtual environment**
    
    ```bash
    python -m venv 'name_venv'
    source 'name_venv'/bin/activate  # or venv\Scripts\activate on Windows
    ```
    
3. **Install dependencies**
    
    ```bash
    pip install -r /path/to/requirements.txt
    ```
    
4. **Run the server**
    
    ```bash
    uvicorn main:app --reload
    ```
5. Create a .env file and add your Key
  AZURE_OPENAI_API_KEY="Key"
  AZURE_OPENAI_ENDPOINT="Endpoint - link"
  AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
  AZURE_OPENAI_MODEL=gpt-35-turbo
  AZURE_OPENAI_API_VERSION="Version"

> Server will be running at: http://127.0.0.1:8000
>
### 🟢 Start the Frontend

```bash
cd chatbot-frontend
npm start
```

