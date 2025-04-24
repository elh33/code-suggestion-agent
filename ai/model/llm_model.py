import os
import gc
import logging
from typing import Optional
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("llm-model")

class QuantizedModel:
    """Lightweight wrapper for quantized LLM models using llama-cpp-python"""
    
    def __init__(
        self, 
        model_name: str = "TheBloke/CodeLlama-7B-Instruct-GGUF", 
        model_file: str = "codellama-7b-instruct.Q4_K_M.gguf",
        download_dir: str = "D:/models",
        temperature: float = 0.7,
        n_ctx: int = 2048,
        n_threads: Optional[int] = None
    ):
        """Initialize a quantized LLM model
        
        Args:
            model_name: Model family name (used for download path)
            model_file: Specific GGUF model file to use
            download_dir: Directory to store model files
            temperature: Temperature for text generation
            n_ctx: Context size
            n_threads: Number of threads to use (None = auto)
        """
        self.model_name = model_name
        self.model_file = model_file
        self.download_dir = download_dir
        self.temperature = temperature
        self.n_threads = n_threads if n_threads else min(8, (os.cpu_count() or 4))
        
        # Create download directory if it doesn't exist
        os.makedirs(download_dir, exist_ok=True)
        
        # Get model path
        self.model_path = self._get_model_path()
        if not os.path.exists(self.model_path):
            self._download_model()
            
        try:
            # Free memory before loading the model
            gc.collect()
                
            # Import llama_cpp here to prevent errors if not needed
            from llama_cpp import Llama
            
            logger.info(f"Loading quantized model from {self.model_path}")
            self.model = Llama(
                model_path=self.model_path,
                n_ctx=n_ctx,
                n_threads=self.n_threads,
                verbose=False,
                n_batch=512,  # Optimal batch size for CPU
                use_mlock=True,  # Lock memory to prevent swapping
                n_gpu_layers=0,  # Explicitly set to 0 for CPU-only
                last_n_tokens_size=64
            )
            logger.info("Model loaded successfully")
            logger.info(f"Running on CPU with {self.n_threads} threads")
        
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise

    def _get_model_path(self) -> str:
        """Get the path to the model file"""
        return os.path.join(self.download_dir, self.model_file)

    def _download_model(self):
        """Download the model from Hugging Face"""
        import requests
        import tqdm
        
        # Format the download URL
        download_url = f"https://huggingface.co/{self.model_name}/resolve/main/{self.model_file}"
        
        logger.info(f"Downloading model from {download_url}")
        
        # Download with progress bar
        response = requests.get(download_url, stream=True)
        total_size = int(response.headers.get("content-length", 0))
        
        with open(self.model_path, "wb") as f, tqdm.tqdm(
            total=total_size,
            unit="B",
            unit_scale=True,
            desc=self.model_file
        ) as progress:
            for chunk in response.iter_content(chunk_size=8192):  # Larger chunk size for faster download
                if chunk:
                    f.write(chunk)
                    progress.update(len(chunk))
        
        logger.info(f"Model downloaded to {self.model_path}")

    def generate(self, prompt: str, max_tokens: int = 1024) -> str:
        """Generate text based on a prompt"""
        # Clean up memory before generation
        gc.collect()
        
        # Log the start time for perf monitoring
        start_time = time.time()
        logger.info(f"Generating text for prompt: {prompt[:50]}...")
        
        # Generate completion with optimized parameters for CPU
        output = self.model.create_completion(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=self.temperature,
            top_p=0.9,
            repeat_penalty=1.2,
            top_k=40,
            stop=["</s>", "<s>", "[INST]", "<<SYS>>"]
        )
        
        # Extract the generated text
        generated_text = output["choices"][0]["text"].strip()
        
        # Log generation time
        end_time = time.time()
        logger.info(f"Generated {len(generated_text)} chars in {end_time - start_time:.2f} seconds")
        
        return generated_text