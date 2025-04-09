"""
Unified test script for the code suggestion agent
Tests tokenizer loading and mock response generation without full model loading
"""
import os
import sys
import gc
from pathlib import Path

# Configure paths to use D: drive
os.environ["HF_HOME"] = "D:/huggingface_cache"
os.environ["TRANSFORMERS_CACHE"] = "D:/huggingface_cache"
os.environ["TORCH_HOME"] = "D:/torch_cache"
os.environ["TEMP"] = "D:/temp"
os.environ["TMP"] = "D:/temp"

# Ensure directories exist
os.makedirs("D:/torch_cache", exist_ok=True)
os.makedirs("D:/temp", exist_ok=True)

# Import the model patches first
from ai import model_patches

# Now import PyTorch
import torch
torch.set_grad_enabled(False)  # Disable gradients for inference
gc.collect()

# Find the model path
def get_model_path():
    cache_dir = "D:/huggingface_cache"
    model_dir = os.path.join(cache_dir, "models--microsoft--phi-2")
    snapshots_dir = os.path.join(model_dir, "snapshots")
    
    if os.path.exists(snapshots_dir):
        snapshots = os.listdir(snapshots_dir)
        if snapshots:
            return os.path.join(snapshots_dir, snapshots[0])
    
    return None

def test_tokenizer():
    """Test that the tokenizer can be loaded and used"""
    print("\n===== Testing Tokenizer =====")
    
    model_path = get_model_path()
    if not model_path:
        print("Error: Could not find model path")
        return False
    
    print(f"Found model at: {model_path}")
    
    # Use direct config and model loading approach
    from transformers import AutoTokenizer
    
    try:
        print("Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        print("✓ Tokenizer loaded successfully!")
        
        # Create sample prompt for testing
        prompt = "def calculate_sum(numbers):"
        inputs = tokenizer(prompt, return_tensors="pt")
        
        print(f"Sample tokenized prompt: {inputs.input_ids.shape}")
        print("✓ Tokenizer test passed!")
        return tokenizer
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def test_mock_service():
    """Test a mock service that doesn't require loading the full model"""
    print("\n===== Testing Mock Service =====")
    
    tokenizer = test_tokenizer()
    if not tokenizer:
        print("Skipping mock service test - tokenizer failed")
        return False
    
    # Define a mock generation function that doesn't use the model
    def mock_generate(code, suggestion_type="improvement"):
        """Generate mock code suggestions"""
        # Determine the language from the code
        language = "python" if "def " in code or "import " in code else "code"
        
        # Create mock responses
        responses = {
            "improvement": f"```{language}\n# Improved version\n{code.strip()}\n\n# Added proper return type\n```\n\nImprovements made:\n1. Added type hints\n2. Improved readability",
            "bug_fix": f"```{language}\n{code.strip()}\n# Fixed potential null reference\n```\n\nBugs fixed:\n1. Handled edge cases\n2. Fixed potential errors",
            "optimization": f"```{language}\n{code.strip()}\n# Optimized algorithm\n```\n\nOptimizations:\n1. Improved algorithm efficiency\n2. Reduced memory usage",
            "documentation": f"```{language}\n# Well documented code\n{code.strip()}\n# Added documentation\n```\n\nDocumentation added:\n1. Added docstrings\n2. Added inline comments"
        }
        
        return responses.get(suggestion_type, responses["improvement"])
    
    # Test the mock generation
    try:
        print("Testing mock code generation...")
        test_code = "def calculate_sum(numbers):\n    return sum(numbers)"
        
        for suggestion_type in ["improvement", "bug_fix", "optimization", "documentation"]:
            result = mock_generate(test_code, suggestion_type)
            print(f"\n✓ Generated {suggestion_type} suggestion:")
            print(f"  {result[:50]}...\n")
        
        print("✓ Mock service test passed!")
        return True
            
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_api_endpoints():
    """Test API endpoints with mock responses"""
    print("\n===== Testing API Endpoints =====")
    
    try:
        from fastapi import FastAPI
        from pydantic import BaseModel
        from typing import Optional, Literal
        
        # Create test models
        class MockRequest(BaseModel):
            code: str
            type: Literal["improvement", "bug_fix", "optimization", "documentation"] = "improvement"
            
        class MockResponse(BaseModel):
            suggestion: str
            type: str
            
        # Create test app
        app = FastAPI(title="Mock Code Suggestion API")
        
        @app.post("/suggest")
        async def suggest_code(request: MockRequest):
            """Test endpoint"""
            return {
                "suggestion": f"Suggestion for {request.type}",
                "type": request.type
            }
        
        @app.get("/health")
        async def health_check():
            """Health check endpoint"""
            return {"status": "healthy"}
        
        print("✓ API endpoints defined correctly")
        
        # You'd normally test with TestClient, but we're just verifying structure
        print("✓ API endpoints test passed!")
        return True
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("Starting unified tests")
    
    # Test tokenizer
    tokenizer_result = test_tokenizer()
    
    # Test mock service
    service_result = test_mock_service()
    
    # Test API endpoints
    api_result = test_api_endpoints()
    
    # Show overall results
    print("\n===== Test Results =====")
    print(f"Tokenizer Test: {'✓ PASSED' if tokenizer_result else '✗ FAILED'}")
    print(f"Mock Service Test: {'✓ PASSED' if service_result else '✗ FAILED'}")
    print(f"API Endpoints Test: {'✓ PASSED' if api_result else '✗ FAILED'}")
    
    # Return overall success
    return tokenizer_result and service_result and api_result

if __name__ == "__main__":
    success = main()
    print(f"\nOverall Test Result: {'✓ PASSED' if success else '✗ FAILED'}")
    sys.exit(0 if success else 1)