# filepath: /c:/Users/Marouane/Desktop/MyCode/python/code-suggestion-agent/ai/service/api.py
import gc
import os
import torch
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional, List, Any, Literal
import uvicorn

from ..chains.code_suggestion import CodeSuggestion
from ..model.phi2_model import Phi2Model
from ..config import CACHE_DIR, DEVICE, VECTORSTORE_DIR

# Configure memory optimization
os.environ["HF_HOME"] = CACHE_DIR
os.environ["TRANSFORMERS_CACHE"] = CACHE_DIR
os.environ["TORCH_HOME"] = f"{os.path.dirname(CACHE_DIR)}/torch_cache"
os.environ["TEMP"] = f"{os.path.dirname(CACHE_DIR)}/temp"
os.environ["TMP"] = f"{os.path.dirname(CACHE_DIR)}/temp"

# Create directories
os.makedirs(f"{os.path.dirname(CACHE_DIR)}/torch_cache", exist_ok=True)
os.makedirs(f"{os.path.dirname(CACHE_DIR)}/temp", exist_ok=True)

# Optimize memory
torch.set_grad_enabled(False)

# Define API models
class SuggestionRequest(BaseModel):
    code: str
    type: Literal["improvement", "bug_fix", "optimization", "refactoring", "documentation"] = "improvement"
    context: Optional[str] = None

class SuggestionResponse(BaseModel):
    suggestion: str
    type: str

# Create FastAPI app
app = FastAPI(title="Code Suggestion API", description="API for code suggestions using Phi-2")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for the components
components = {
    "phi2_model": None,
    "vector_store": None,
    "code_suggestion": None
}

def init_components():
    """Initialize the AI components if not already done"""
    # Run garbage collection first
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    
    if components["phi2_model"] is None:
        components["phi2_model"] = Phi2Model(
            cache_dir=CACHE_DIR,
            device=DEVICE,
            optimize_memory=True
        )
        
    if components["code_suggestion"] is None:
        components["code_suggestion"] = CodeSuggestion(
            model_pipeline=components["phi2_model"].pipeline,
            vectorstore=components["vector_store"]
        )

@app.post("/suggest", response_model=SuggestionResponse)
async def suggest_code(request: SuggestionRequest):
    """Generate code suggestions"""
    # Initialize components if needed
    init_components()
    
    try:
        suggestion = components["code_suggestion"].generate_suggestion(
            code=request.code,
            suggestion_type=request.type,
            context=request.context
        )
        
        # Run garbage collection
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            
        return {"suggestion": suggestion, "type": request.type}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating suggestion: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "model": "phi-2"}

def start_api(host="localhost", port=8000):
    """Start the API server"""
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    start_api()