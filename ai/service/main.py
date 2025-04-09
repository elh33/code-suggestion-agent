import argparse
import asyncio
import logging
import sys
import os
from pathlib import Path

# Add the parent directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from ai.config import HOST, PORT, WEBSOCKET_PATH, MODEL_NAME, CACHE_DIR, VECTORSTORE_DIR
from ai.model.phi2_model import Phi2Model
from ai.model.embeddings import CodeEmbeddings
from ai.vectorstore.chroma_store import ChromaVectorStore
from ai.service.ws_server import CodeSuggestionServer
from ai.service.api import start_api

async def start_ws_server(args):
    """Start the WebSocket server"""
    # Initialize components
    phi2_model = Phi2Model(
        model_name=args.model_name,
        cache_dir=args.cache_dir,
        device=args.device
    )
    
    # Initialize embeddings
    embeddings = CodeEmbeddings(
        model_name=args.embedding_model,
        cache_dir=args.cache_dir,
        device=args.device
    )
    
    # Create embedding function for ChromaDB
    def embedding_function(texts):
        return embeddings.embed_text(texts)
    
    # Initialize vector store
    vector_store = ChromaVectorStore(
        persist_directory=args.vectorstore_dir,
        collection_name=args.collection_name,
        embedding_function=embedding_function
    )
    
    # Create and start the WebSocket server
    server = CodeSuggestionServer(
        host=args.host,
        port=args.port,
        phi2_model=phi2_model,
        vector_store=vector_store
    )
    
    await server.start()

def start_rest_api(args):
    """Start the REST API server"""
    start_api(host=args.host, port=args.port)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Code Suggestion Service')
    parser.add_argument('--service', choices=['ws', 'api'], default='ws',
                        help='Service to run: WebSocket (ws) or REST API (api)')
    parser.add_argument('--host', default=HOST, help='Server host')
    parser.add_argument('--port', type=int, default=PORT, help='Server port')
    parser.add_argument('--model-name', default=MODEL_NAME, help='Model name')
    parser.add_argument('--cache-dir', default=CACHE_DIR, help='Model cache directory')
    parser.add_argument('--device', default='cpu', choices=['cpu', 'cuda'], help='Device to run on')
    parser.add_argument('--vectorstore-dir', default=VECTORSTORE_DIR, help='Vector store directory')
    parser.add_argument('--collection-name', default='code_suggestions', help='Collection name')
    parser.add_argument('--embedding-model', default='sentence-transformers/all-MiniLM-L6-v2',
                        help='Embedding model name')
    
    args = parser.parse_args()
    
    if args.service == 'ws':
        asyncio.run(start_ws_server(args))
    else:
        start_rest_api(args)