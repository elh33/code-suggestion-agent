import asyncio
import json
import logging
import websockets
from typing import Dict, Any, Set, Optional
from ..chains.code_suggestion import CodeSuggestion
from ..model.phi2_model import Phi2Model
from ..vectorstore.chroma_store import ChromaVectorStore

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("code-suggestion-ws")

class CodeSuggestionServer:
    """WebSocket server for code suggestions"""
    
    def __init__(
        self,
        host: str = "localhost",
        port: int = 8000,
        phi2_model: Optional[Phi2Model] = None,
        vector_store: Optional[ChromaVectorStore] = None
    ):
        """Initialize the WebSocket server
        
        Args:
            host: Server host
            port: Server port
            phi2_model: Initialized Phi2Model instance
            vector_store: Initialized vector store
        """
        self.host = host
        self.port = port
        self.phi2_model = phi2_model
        self.vector_store = vector_store
        
        # Initialize components if not provided
        if not self.phi2_model:
            logger.info("Initializing Phi-2 model")
            self.phi2_model = Phi2Model()
            
        # Create code suggestion chain
        self.code_suggestion = CodeSuggestion(
            model_pipeline=self.phi2_model.pipeline,
            vectorstore=self.vector_store
        )
        
        # Active connections
        self.connections: Set[websockets.WebSocketServerProtocol] = set()
    
    async def register(self, websocket: websockets.WebSocketServerProtocol):
        """Register a new client connection"""
        self.connections.add(websocket)
        logger.info(f"Client connected. Total connections: {len(self.connections)}")
    
    async def unregister(self, websocket: websockets.WebSocketServerProtocol):
        """Unregister a client connection"""
        self.connections.remove(websocket)
        logger.info(f"Client disconnected. Total connections: {len(self.connections)}")
    
    async def handle_message(self, websocket: websockets.WebSocketServerProtocol, message: str):
        """Handle incoming WebSocket messages
        
        Args:
            websocket: WebSocket connection
            message: JSON message string
        """
        try:
            # Parse message
            data = json.loads(message)
            request_id = data.get("id", "unknown")
            action = data.get("action")
            
            if action == "suggest":
                await self.handle_suggestion(websocket, request_id, data)
            else:
                await websocket.send(json.dumps({
                    "id": request_id,
                    "status": "error",
                    "message": f"Unknown action: {action}"
                }))
                
        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
            await websocket.send(json.dumps({
                "status": "error",
                "message": "Invalid JSON format"
            }))
        except Exception as e:
            logger.exception(f"Error handling message: {str(e)}")
            await websocket.send(json.dumps({
                "status": "error",
                "message": f"Server error: {str(e)}"
            }))
    
    async def handle_suggestion(
        self, 
        websocket: websockets.WebSocketServerProtocol, 
        request_id: str,
        data: Dict[str, Any]
    ):
        """Handle code suggestion requests
        
        Args:
            websocket: WebSocket connection
            request_id: Request identifier
            data: Request data
        """
        code = data.get("code", "")
        suggestion_type = data.get("type", "improvement")
        context = data.get("context", None)
        
        if not code:
            await websocket.send(json.dumps({
                "id": request_id,
                "status": "error",
                "message": "No code provided"
            }))
            return
            
        # Send acknowledgment
        await websocket.send(json.dumps({
            "id": request_id,
            "status": "processing"
        }))
        
        # Generate suggestion
        try:
            suggestion = self.code_suggestion.generate_suggestion(
                code=code,
                suggestion_type=suggestion_type,
                context=context
            )
            
            # Send response
            await websocket.send(json.dumps({
                "id": request_id,
                "status": "success",
                "suggestion": suggestion,
                "type": suggestion_type
            }))
            
        except Exception as e:
            logger.exception(f"Error generating suggestion: {str(e)}")
            await websocket.send(json.dumps({
                "id": request_id,
                "status": "error",
                "message": f"Error generating suggestion: {str(e)}"
            }))
    
    async def handler(self, websocket: websockets.WebSocketServerProtocol, path: str):
        """WebSocket connection handler
        
        Args:
            websocket: WebSocket connection
            path: Connection path
        """
        await self.register(websocket)
        try:
            async for message in websocket:
                await self.handle_message(websocket, message)
        except websockets.ConnectionClosed:
            pass
        finally:
            await self.unregister(websocket)
    
    async def start(self):
        """Start the WebSocket server"""
        async with websockets.serve(self.handler, self.host, self.port):
            logger.info(f"WebSocket server started on ws://{self.host}:{self.port}")
            await asyncio.Future()  # Run forever