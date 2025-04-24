# Code Suggestion Agent

## Overview
The Code Suggestion Agent is an intelligent real-time code suggestion tool built using a modern tech stack. It leverages Next.js for the frontend, FastAPI for the backend, and integrates advanced AI capabilities for generating code suggestions.

## Project Structure
```
code-suggestion-agent
├── frontend          # Frontend application using Next.js
├── backend           # Backend application using FastAPI
├── ai                # AI components for code suggestions
└── docs              # Documentation
```


## 🛠 Stack Technique & Dependencies

### Frontend (Next.js 14 + ShadCN)
- **next.js**: Framework for building React applications.
- **shadcn/ui**: Modern UI components.
- **tailwindcss**: Utility-first CSS framework for styling.
- **@monaco-editor/react**: Code editor component.
- **socket.io-client**: WebSocket communication with the backend.
- **axios**: For making API requests.
- **eslint + prettier**: For linting and code formatting.

### Backend (FastAPI + WebSockets)
- **fastapi**: Fast web framework for building APIs.
- **uvicorn**: ASGI server for running FastAPI applications.
- **websockets**: Support for WebSocket connections.
- **pydantic**: Data validation and settings management.
- **langchain**: For integrating language models and workflows.
- **motor**: MongoDB async driver if needed.

### AI Component (LangChain + StarCoder + ChromaDB)
- **langchain**: For managing prompts and AI model workflows.
- **transformers**: Hugging Face's transformers library for StarCoder model.
- **torch**: PyTorch for StarCoder model processing.
- **chromadb**: Open-source vector database for storing code embeddings.
- **sentence-transformers**: For generating code embeddings.
- **fastapi & websockets**: For real-time code suggestion delivery.
- **pydantic**: For data validation and settings management.

## Installation Instructions

### Prerequisites
- Node.js (for frontend)
- Python 3.8+ (for backend and AI)
- At least 8GB RAM (16GB recommended for optimal StarCoder performance)
- CUDA-compatible GPU (optional, but recommended for faster inference)

### Setup

1. **Clone the repository**
   ```
   git clone https://github.com/elh33/code-suggestion-agent.git
   cd code-suggestion-agent
   ```


2. **Frontend Setup**
- Navigate to the frontend directory:
  ```
  cd frontend
  ```
- Install dependencies:
  ```
  npm install
  ```
- Start the Next.js application:
  ```
  npm run dev
  ```

3. **Backend Setup**
- Navigate to the backend directory:
  ```
  cd ../backend
  ```
- Install dependencies:
  ```
  pip install -r requirements.txt
  ```
- Start the FastAPI application:
  ```
  uvicorn app.main:app --reload
  ```

4. **AI Setup**

- Navigate to the AI directory:  
  ```bash
  cd ../ai
  ```

- Install dependencies:  
  ```bash
  pip install -r requirements.txt
  ```

- Configure environment variables (optional):  
  - Copy the example env file:  
    ```bash
    cp .env.example .env
    ```
  - Edit the `.env` file to customize settings.

- Start the AI service:  
  ```bash
  start_websocket_service.bat
  ```

---

## **AI Component Configuration**

The AI component now uses environment variables for configuration:

```env
MODEL_FILE=codellama-7b-instruct.Q4_K_M.gguf
MODEL_DOWNLOAD_DIR=D:/models
DEVICE=cpu
TEMPERATURE=0.7
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
VECTORSTORE_DIR=D:/code_vectorstore
```

---

## **How the AI Component Works**

The AI component has several key modules:

1. **Code Suggestion Module**  
   Uses a quantized CodeLlama 7B model (GGUF format) for generating high-quality code completions, fixes, and implementations.

2. **Embeddings Module**  
   Uses a lightweight Sentence Transformer model for code similarity search.

3. **Vector Store Module**  
   Uses ChromaDB to store and retrieve similar code examples.

4. **WebSocket Interface**  
   Provides real-time code suggestions through a WebSocket API.

---

## **WebSocket Endpoint**

- **URL:** `ws://localhost:8000`
- **Send:** JSON with:
  ```json
  {
    "id": "unique_id",
    "type": "completion | fix | generate",
    "code": "your_code_here"
  }
  ```
- **Receive:** JSON with:
  ```json
  {
    "id": "unique_id",
    "status": "success",
    "suggestion": "code_suggestion"
  }
  ```

---

## **Types of Code Suggestions**

- **completion** – Completes partial code blocks  
- **fix** – Identifies and fixes bugs in code  
- **generate** – Creates code implementations from requirements

---

## **Testing the Connection**

- Start the WebSocket service:
  ```bash
  start_websocket_service.bat
  ```

- Run the test client:
  ```bash
  python test_ws.py
  ```

- Select the type of suggestion you want to test  
- Response time: **30–120 seconds**, depending on complexity