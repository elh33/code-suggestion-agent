# Setup Instructions for Code Suggestion Agent

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (version 14 or higher)
- Python (version 3.8 or higher)
- pip (Python package installer)
- Docker (optional, for backend deployment)

## Project Structure

The project is organized into three main directories:

- **frontend**: Contains the Next.js application.
- **backend**: Contains the FastAPI application.
- **ai**: Contains AI-related components and logic.
- **docs**: Contains documentation files.

## Installation Steps

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/code-suggestion-agent.git
cd code-suggestion-agent
```

### 2. Set Up the Frontend

Navigate to the `frontend` directory and install the dependencies:

```bash
cd frontend
npm install
```

### 3. Set Up the Backend

Navigate to the `backend` directory and install the dependencies:

```bash
cd ../backend
pip install -r requirements.txt
```

### 4. Set Up the AI Components

Navigate to the `ai` directory and install the dependencies:

```bash
cd ../ai
pip install -r requirements.txt
```

### 5. Running the Applications

#### Start the Backend

To run the FastAPI backend, navigate to the `backend` directory and use Uvicorn:

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Start the Frontend

In a new terminal window, navigate to the `frontend` directory and start the Next.js application:

```bash
cd frontend
npm run dev
```

### 6. Testing the Connection

Once both applications are running, you can test the connection between the frontend and backend by accessing the frontend application in your browser at `http://localhost:3000`. Ensure that the backend is accessible at `http://localhost:8000`.

## Additional Notes

- For Docker users, you can build and run the backend using the provided Dockerfile.
- Make sure to configure any environment variables as needed for your specific setup.

## Conclusion

You are now set up to start developing the Code Suggestion Agent project! For further details on API usage, refer to the `docs/api.md` file.