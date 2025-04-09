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
   git clone https://github.com/yourusername/code-suggestion-agent.git
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
  ```
  cd ../ai
  ```
- Install dependencies:
  ```
  pip install -r requirements.txt
  ```
- Configure environment variables (optional):
  - Copy the example env file: `cp .env.example .env`
  - Edit the `.env` file to customize settings

- Start the AI service:
  ```
  uvicorn api:app --reload --port 8001
  ```

## AI Component Configuration

The AI component uses environment variables for configuration, which can be set in a `.env` file:

### StarCoder settings
STARCODER_MODEL=bigcode/starcoder # Model name from Hugging Face DEVICE=cpu # Use "cuda" if you have a compatible GPU TEMPERATURE=0.7 # Higher values = more creative suggestions

### ChromaDB settings
CHROMA_PERSIST_DIR=chroma_db # Directory for persistent storage

### Embedding settings
EMBEDDING_MODEL=all-MiniLM-L6-v2 # Sentence transformer model for embeddings

## How the AI Component Works

The AI component has several key modules that work together:

1. **Code Suggestion Module**: Uses StarCoder (an open-source code generation model) through LangChain to provide intelligent code suggestions.

2. **Embeddings Module**: Converts code snippets into vector embeddings using Sentence Transformers.

3. **Vector Store Module**: Stores and retrieves similar code snippets using ChromaDB (an open-source vector database).

4. **Coordinator**: Orchestrates the workflow between these components.

5. **API Interface**: Provides both REST API and WebSocket endpoints for real-time code suggestions.

## API Endpoints

### REST Endpoints

- `POST /api/suggest`: Submit code for suggestions
  - Request body: `{code, file_path, language, surrounding_code, project_context, suggestion_type}`
  - Returns: `{suggestions: [{suggestion, confidence, source}]}`

- `POST /api/feedback`: Submit feedback on suggestions
  - Request body: `{code, file_path, language}` + `improved_code`
  - Returns: Success/failure message

### WebSocket Endpoint

- `ws://localhost:8001/ws/suggest`: Real-time code suggestions
  - Send: JSON with `{code, file_path, language, surrounding_code, project_context, suggestion_type}`
  - Receive: JSON with `{type: "suggestion", suggestions: [{suggestion, confidence, source}]}`

## Types of Code Suggestions

The AI component can provide different types of code suggestions:

- **improvement**: General code improvements for readability and maintainability
- **bug_fix**: Identification and correction of potential bugs
- **optimization**: Suggestions for performance improvements
- **refactoring**: Structural improvements without changing behavior
- **documentation**: Improvements to code comments and documentation

## Testing the Connection
- Ensure all three services (frontend, backend, and AI) are running.
- Test the connection by using the integrated code editor and checking for real-time suggestions.