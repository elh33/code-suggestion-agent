import asyncio
import json
import logging
import time
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
        port: int = 8001,
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
            
            # Support both message formats - check for test client format
            if data.get("type") == "optimization_request":
                # Handle the test client format
                optimization_type = data.get("optimizationType", "performance")
                code = data.get("code", "")
                
                # Map client suggestion types to valid server types
                suggestion_type_map = {
                    "performance": "optimization",  # Map performance to optimization
                    "bugfix": "fix",                # Map bugfix to fix
                    "refactoring": "refactoring",   # This one stays the same
                    "completion": "completion"      # This one stays the same
                }
                
                # Convert the suggestion type to the server-expected format
                mapped_suggestion_type = suggestion_type_map.get(optimization_type, "completion")
                logger.info(f"Mapped client type '{optimization_type}' to server type '{mapped_suggestion_type}'")
                
                # Convert to the original format
                converted_data = {
                    "id": f"test-{int(time.time())}",
                    "type": mapped_suggestion_type,  # Use mapped type
                    "originalType": optimization_type,  # Store original type for response
                    "code": code,
                    "context": f"Provide {optimization_type} improvements for this code.",
                    "fromTestClient": True  # Mark as coming from test client
                }
                
                # Process with the standard handler
                await self.handle_suggestion(websocket, converted_data["id"], converted_data)
            else:
                # Original format
                request_id = data.get("id", "unknown")
                
                # Map client suggestion types to valid server types
                suggestion_type = data.get("type", "completion")
                suggestion_type_map = {
                    "performance": "optimization",  # Map performance to optimization
                    "bugfix": "fix",                # Map bugfix to fix
                    "refactoring": "refactoring",   # This one stays the same
                    "completion": "completion"      # This one stays the same
                }
                
                # Convert the suggestion type to the server-expected format and update in data
                data["type"] = suggestion_type_map.get(suggestion_type, "completion")
                data["originalType"] = suggestion_type  # Store original type
                
                logger.info(f"Mapped client type '{suggestion_type}' to server type '{data['type']}'")
                
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
        suggestion_type = data.get("type", "completion")  # This is now the mapped type
        original_type = data.get("originalType", suggestion_type)  # Get original client type
        context = data.get("context", None)
        
        # Check if this is from the test client
        is_test_client = data.get("fromTestClient", False)
        
        if context is None:
            # Format context better
            context = "No additional context available."
        
        if not code:
            if is_test_client:
                await websocket.send(json.dumps({
                    "type": "optimization_response",
                    "optimizationType": original_type,  # Use original type in response
                    "suggestions": [],
                    "message": "No code provided",
                    "timestamp": time.time()
                }))
            else:
                await websocket.send(json.dumps({
                    "id": request_id,
                    "status": "error",
                    "message": "No code provided"
                }))
            return
            
        # Send acknowledgment - only for original format
        if not is_test_client:
            await websocket.send(json.dumps({
                "id": request_id,
                "status": "processing"
            }))
        
        # Generate suggestion
        try:
            # Log the type being passed to the model
            logger.info(f"Generating suggestion of type: {suggestion_type}")
            
            # Start a task to generate the suggestion
            loop = asyncio.get_running_loop()
            suggestion = await loop.run_in_executor(
                None,
                lambda: self.code_suggestion.generate_suggestion(
                    code=code,
                    suggestion_type=suggestion_type,  # Use the mapped type
                    context=context
                )
            )
            
            # Clean up the suggestion - remove instruction formatting if present
            if "[/INST]" in suggestion:
                suggestion = suggestion.split("[/INST]", 1)[1].strip()
            
            # Send response - different format based on client type
            if is_test_client:
                # Format for test client
                suggestions = [{
                    "id": f"sugg-{int(time.time())}",
                    "type": original_type,  # Use original type in response
                    "lineNumber": 1,
                    "code": code.strip().split("\n")[0] if "\n" in code else code.strip(),
                    "replacement": suggestion,
                    "description": f"Model-generated {original_type} suggestion",
                    "severity": "info"
                }]
                
                await websocket.send(json.dumps({
                    "type": "optimization_response",
                    "optimizationType": original_type,  # Use original type in response
                    "suggestions": suggestions,
                    "timestamp": time.time()
                }))
            else:
                # Original format
                await websocket.send(json.dumps({
                    "id": request_id,
                    "status": "success",
                    "suggestion": suggestion,
                    "type": original_type  # Use original type in response
                }))
        except Exception as e:
            logger.exception(f"Error generating suggestion: {str(e)}")
            
            if is_test_client:
                await websocket.send(json.dumps({
                    "type": "error",
                    "optimizationType": original_type,  # Use original type in response
                    "suggestions": [],
                    "message": f"Error generating suggestions: {str(e)}",
                    "timestamp": time.time()
                }))
            else:
                await websocket.send(json.dumps({
                    "id": request_id,
                    "status": "error",
                    "message": f"Error generating suggestion: {str(e)}"
                }))
    
    async def handler(self, websocket, path=None):
        """WebSocket connection handler
        
        Args:
            websocket: WebSocket connection
            path: Connection path (optional)
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
        server = await websockets.serve(
            self.handler,
            self.host,
            self.port
        )
        logger.info(f"WebSocket server started on ws://{self.host}:{self.port}")
        await server.wait_closed()  # More reliable than asyncio.Future()