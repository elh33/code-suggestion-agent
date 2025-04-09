import os
import gc
import torch
from pathlib import Path
from transformers import PhiForCausalLM, AutoTokenizer, pipeline
from typing import Dict, List, Optional, Union

class Phi2Model:
    """Optimized wrapper for the Microsoft Phi-2 model"""
    
    def __init__(
        self, 
        model_name: str = "microsoft/phi-2", 
        cache_dir: str = "D:/huggingface_cache",
        device: str = "cpu",
        temperature: float = 0.7,
        optimize_memory: bool = True
    ):
        """Initialize the Phi-2 model with memory optimizations
        
        Args:
            model_name: Name or path of the model
            cache_dir: Directory containing cached model files
            device: Device to run the model on ('cpu' or 'cuda')
            temperature: Temperature for text generation
            optimize_memory: Apply memory optimizations
        """
        # Setup torch for lower memory usage
        if optimize_memory:
            torch.set_grad_enabled(False)  # Disable gradients
        
        self.model_name = model_name
        self.cache_dir = cache_dir
        self.device = device
        self.temperature = temperature
        
        # Find the model path
        model_path = self._find_snapshot_path() or model_name
        print(f"Loading Phi-2 model from {model_path}")
        
        # Configure cache directories to use D: drive
        os.environ["HF_HOME"] = cache_dir
        os.environ["TRANSFORMERS_CACHE"] = cache_dir
        os.environ["TORCH_HOME"] = os.path.join(os.path.dirname(cache_dir), "torch_cache")
        
        try:
            # Load the tokenizer first (smaller)
            print("Loading tokenizer...")
            self.tokenizer = AutoTokenizer.from_pretrained(
                model_path,
                use_fast=True
            )
            
            # Free memory before loading model
            gc.collect()
            
            # Load model with memory optimizations
            print("Loading model...")
            self.model = PhiForCausalLM.from_pretrained(
                model_path,
                torch_dtype=torch.float32,
                low_cpu_mem_usage=True
            )
            
            # Move model to device
            if device == "cuda" and torch.cuda.is_available():
                print("Moving model to GPU...")
                self.model = self.model.to("cuda")
            else:
                print("Using CPU for inference")
            
            # Create pipeline with optimized settings
            self.pipeline = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                max_length=256,
                pad_token_id=self.tokenizer.eos_token_id
            )
            
            print("Model loaded successfully")
            
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise
    
    def _find_snapshot_path(self) -> Optional[str]:
        """Find the path to the locally cached model snapshot"""
        model_dir = os.path.join(self.cache_dir, "models--microsoft--phi-2")
        snapshots_dir = os.path.join(model_dir, "snapshots")
        
        if os.path.exists(snapshots_dir):
            snapshots = os.listdir(snapshots_dir)
            if snapshots:
                return os.path.join(snapshots_dir, snapshots[0])
        return None
    
    def generate(self, prompt: str, max_tokens: int = 128) -> str:
        """Generate text based on a prompt with memory optimization
        
        Args:
            prompt: Input text to generate from
            max_tokens: Maximum number of tokens to generate
            
        Returns:
            Generated text
        """
        # Free memory before generation
        gc.collect()
        
        result = self.pipeline(
            prompt,
            max_new_tokens=max_tokens,
            do_sample=True,
            temperature=self.temperature,
            num_return_sequences=1,
        )
        
        generated_text = result[0]['generated_text']
        
        # Extract only the newly generated content
        response = generated_text[len(prompt):] if generated_text.startswith(prompt) else generated_text
        
        # Clean up memory
        gc.collect()
        
        return response