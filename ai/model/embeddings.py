from typing import List, Union
from sentence_transformers import SentenceTransformer

class CodeEmbeddings:
    """Text embeddings for code snippets"""
    
    def __init__(
        self, 
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        cache_dir: str = "D:/huggingface_cache",
        device: str = "cpu"
    ):
        """Initialize the embedding model
        
        Args:
            model_name: Name of the embedding model
            cache_dir: Directory for model cache
            device: Device to run on ('cpu' or 'cuda')
        """
        self.model_name = model_name
        self.cache_dir = cache_dir
        self.device = device
        
        # Load the model
        self.model = SentenceTransformer(
            model_name, 
            cache_folder=cache_dir,
            device=device
        )
        
        print(f"Embedding model {model_name} loaded")
    
    def embed_text(self, text: Union[str, List[str]]) -> List[List[float]]:
        """Generate embeddings for text
        
        Args:
            text: Text or list of texts to embed
            
        Returns:
            List of embedding vectors
        """
        # Ensure text is a list
        if isinstance(text, str):
            text = [text]
            
        # Generate embeddings
        embeddings = self.model.encode(text)
        
        return embeddings.tolist()