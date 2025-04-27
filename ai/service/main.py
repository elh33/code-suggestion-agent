import argparse
import asyncio
import logging
import os
import sys
from pathlib import Path

# Add the parent directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from ai.config import HOST, PORT, MODEL_NAME, MODEL_FILE, CACHE_DIR, MODEL_DOWNLOAD_DIR, VECTORSTORE_DIR
from ai.model.llm_model import QuantizedModel
from ai.model.embeddings import CodeEmbeddings
from ai.vectorstore.chroma_store import ChromaVectorStore
from ai.service.ws_server import CodeSuggestionServer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("service")

async def start_ws_server(args):
    """Start the WebSocket server"""
    # Initialize components with settings optimized for 8GB RAM systems
    logger.info("Initializing model with memory-optimized settings...")
    
    # Format model path properly using os.path.normpath to fix slashes
    model_path = os.path.normpath(os.path.join(args.download_dir, args.model_file))
    logger.info(f"Loading model from: {model_path}")
    
    try:
        # Check if model file exists
        if not os.path.exists(model_path):
            logger.error(f"Model file not found at: {model_path}")
            raise FileNotFoundError(f"Model file not found: {model_path}")
            
        # Get model file size
        model_size_mb = os.path.getsize(model_path) / (1024 * 1024)
        logger.info(f"Model file size: {model_size_mb:.2f} MB")
        
        # Initialize model with conservative memory settings - use only supported parameters
        model = QuantizedModel(
            model_name=args.model_name,
            model_file=model_path,
            download_dir=args.download_dir,
            temperature=0.7,
            n_ctx=256,        # Reduced context window 
            n_threads=1       # Single thread
        )
        logger.info("Model loaded successfully with reduced memory settings")
    except Exception as e:
        logger.error(f"Error initializing model: {str(e)}")
        logger.info("Starting server with mock model functionality")
        model = None  # Server will use mock implementations if model is None
    
    try:
        # Initialize embeddings
        logger.info("Initializing embeddings...")
        embeddings = CodeEmbeddings(
            model_name=args.embedding_model,
            cache_dir=args.cache_dir,
            device="cpu"
        )
        
        # Create a properly formatted embedding function for ChromaDB
        class ChromaEmbeddingFunction:
            def __init__(self, embeddings_model):
                self.embeddings_model = embeddings_model
                
            def __call__(self, input):
                """ChromaDB expects this specific signature with 'input' parameter"""
                return self.embeddings_model.embed_text(input)
        
        # Initialize vector store with properly formatted embedding function
        logger.info("Initializing vector store...")
        vector_store = ChromaVectorStore(
            persist_directory=args.vectorstore_dir,
            collection_name=args.collection_name,
            embedding_function=ChromaEmbeddingFunction(embeddings)
        )
    except Exception as e:
        logger.error(f"Error initializing embeddings or vector store: {str(e)}")
        logger.info("Starting server without vector store functionality")
        vector_store = None  # Server will work without vector store
    
    # Create and start the WebSocket server
    logger.info(f"Starting WebSocket server on {args.host}:{args.port}...")
    server = CodeSuggestionServer(
        host=args.host,
        port=args.port,
        model=model,
        vector_store=vector_store
    )
    
    await server.start()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Code Suggestion Service')
    parser.add_argument('--host', default=HOST, help='Server host')
    parser.add_argument('--port', type=int, default=PORT, help='Server port')
    parser.add_argument('--model-name', default=MODEL_NAME, help='Model name')
    parser.add_argument('--model-file', default=MODEL_FILE, help='Model file name')
    parser.add_argument('--download-dir', default=MODEL_DOWNLOAD_DIR, help='Model download directory')
    parser.add_argument('--cache-dir', default=CACHE_DIR, help='Model cache directory')
    parser.add_argument('--vectorstore-dir', default=VECTORSTORE_DIR, help='Vector store directory')
    parser.add_argument('--collection-name', default='code_suggestions', help='Collection name')
    parser.add_argument('--embedding-model', default='sentence-transformers/all-MiniLM-L6-v2',
                      help='Embedding model name')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    parser.add_argument('--mock', action='store_true', help='Use mock model instead of loading real model')
    
    args = parser.parse_args()
    
    # Set higher logging level if debug mode is enabled
    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # If mock mode is enabled, don't try to load the real model
    if args.mock:
        args.model = None
        
    try:
        asyncio.run(start_ws_server(args))
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)