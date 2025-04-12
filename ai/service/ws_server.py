import asyncio
import json
import logging
import websockets
from typing import Dict, Any, Set, Optional
from ..chains.code_suggestion import CodeSuggestion
from ..model.llm_model import QuantizedModel
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
        model: Optional[QuantizedModel] = None,
        vector_store: Optional[ChromaVectorStore] = None
    ):
        """Initialize the WebSocket server
        
        Args:
            host: Server host
            port: Server port
            model: Initialized Model instance
            vector_store: Initialized vector store
        """
        self.host = host
        self.port = port
        self.model = model
        self.vector_store = vector_store
        
        # Initialize components if not provided
        if not self.model:
            logger.info("Initializing model")
            self.model = QuantizedModel()
            
        # Create code suggestion chain - pass the model directly
        self.code_suggestion = CodeSuggestion(
            model_pipeline=self.model,  # Pass the model itself
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
            data = json.loads(message)
            request_id = data.get("id", "unknown")
            
            # Handle suggestion request
            await self.handle_suggestion(websocket, request_id, data)
                
        except json.JSONDecodeError:
            await websocket.send(json.dumps({
                "status": "error",
                "message": "Invalid JSON message"
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
        """Handle code suggestion requests"""
        code = data.get("code", "")
        suggestion_type = data.get("type", "completion")
        context = data.get("context", None)
        
        if context is None:
            # Format context better
            context = "No additional context available."
        
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
            # Start a task to generate the suggestion
            loop = asyncio.get_running_loop()
            suggestion = await loop.run_in_executor(
                None,
                lambda: self.code_suggestion.generate_suggestion(
                    code=code,
                    suggestion_type=suggestion_type,
                    context=context
                )
            )
            
            # Clean up the suggestion - remove instruction formatting if present
            if "[/INST]" in suggestion:
                suggestion = suggestion.split("[/INST]", 1)[1].strip()
            
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
            logger.info("Connection closed normally")
        except Exception as e:
            logger.exception(f"Error in handler: {str(e)}")
        finally:
            await self.unregister(websocket)
    
    async def start(self):
        """Start the WebSocket server"""
        async with websockets.serve(self.handler, self.host, self.port):
            logger.info(f"WebSocket server started on ws://{self.host}:{self.port}")
            await asyncio.Future()  # Run forever