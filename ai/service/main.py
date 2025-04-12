import argparse
import asyncio
import logging
import sys
import os
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
    # Initialize components
    logger.info("Initializing model...")
    model = QuantizedModel(
        model_name=args.model_name,
        model_file=args.model_file,
        download_dir=args.download_dir,
        temperature=0.7,
        n_threads=min(4, os.cpu_count() or 4),
        n_ctx=1024  # Use smaller context to save memory
    )
    
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
    
    args = parser.parse_args()
    asyncio.run(start_ws_server(args))