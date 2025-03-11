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
- **pinecone-client or cassandra-driver**: Connection to vector databases.
- **openai**: API for accessing language models.
- **langchain**: For integrating language models and workflows.
- **motor**: MongoDB async driver if needed.

### Intelligence Artificielle (LangChain + Vector Database)
- **langchain**: For managing prompts and AI models.
- **openai**: Access to OpenAI's language models.
- **pinecone-client or astra-db**: For vector storage and retrieval.
- **sentence-transformers**: For generating embeddings.
- **tiktoken**: For tokenization of language models.

## Installation Instructions

### Prerequisites
- Node.js (for frontend)
- Python 3.8+ (for backend)
- Docker (optional, for backend)

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

## Testing the Connection
- Ensure both the frontend and backend are running.
- Test the connection between the frontend and backend by using the integrated code editor and checking for real-time suggestions.

## Documentation
- For detailed setup instructions, refer to the [setup documentation](docs/setup.md).
- For API usage and endpoints, refer to the [API documentation](docs/api.md).

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.