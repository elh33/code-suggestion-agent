import os
from typing import Dict, List, Optional, Union
import chromadb
from chromadb.config import Settings

class ChromaVectorStore:
    """Vector database for storing and retrieving code embeddings"""
    
    def __init__(
        self, 
        persist_directory: str, 
        collection_name: str = "code_suggestions",
        embedding_function = None
    ):
        """Initialize ChromaDB vector store
        
        Args:
            persist_directory: Directory to persist vector database
            collection_name: Name of the collection
            embedding_function: Function to generate embeddings (optional)
        """
        self.persist_directory = persist_directory
        self.collection_name = collection_name
        self.embedding_function = embedding_function
        
        # Create directory if it doesn't exist
        os.makedirs(persist_directory, exist_ok=True)
        
        # Initialize client
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(allow_reset=True)
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=embedding_function
        )
        
        print(f"ChromaDB initialized with collection: {collection_name}")
    
    def add_documents(
        self, 
        documents: List[str],
        ids: Optional[List[str]] = None,
        metadatas: Optional[List[Dict]] = None,
        embeddings: Optional[List[List[float]]] = None
    ) -> List[str]:
        """Add documents to the vector store
        
        Args:
            documents: List of documents to add
            ids: List of IDs for the documents
            metadatas: List of metadata for the documents
            embeddings: List of embeddings for the documents (optional)
            
        Returns:
            List of IDs for the added documents
        """
        # Generate IDs if not provided
        if ids is None:
            import uuid
            ids = [str(uuid.uuid4()) for _ in range(len(documents))]
        
        # Add documents
        self.collection.add(
            documents=documents,
            ids=ids,
            metadatas=metadatas,
            embeddings=embeddings
        )
        
        return ids
    
    def search(
        self, 
        query: Union[str, List[float]], 
        n_results: int = 5,
        where: Optional[Dict] = None
    ) -> Dict:
        """Search for similar documents
        
        Args:
            query: Query text or embedding vector
            n_results: Number of results to return
            where: Filter criteria
            
        Returns:
            Dict with search results
        """
        # If query is a string and we have an embedding function, convert it to an embedding
        query_embedding = None
        if isinstance(query, str) and self.embedding_function:
            query_embedding = self.embedding_function([query])[0]
        
        # Perform search
        if query_embedding is not None:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where
            )
        else:
            results = self.collection.query(
                query_texts=[query] if isinstance(query, str) else None,
                n_results=n_results,
                where=where
            )
        
        return results