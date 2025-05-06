import asyncio
import json
import time
import websockets
import sys

async def test_websocket_client():
    """Test the WebSocket service"""
    uri = "ws://localhost:8001"
    
    print(f"Connecting to {uri}...")
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected!")
            
            # Select test type
            print("\nSelect test type:")
            print("1. Code Completion")
            print("2. Code Fix")
            print("3. Code Generation")
            
            choice = input("Enter choice (1-3): ")
            
            if choice == "1":
                # Test code completion
                code = """
def calculate_sum(numbers):
    total = 0
    for number in 
"""
                suggestion_type = "completion"
                
            elif choice == "2":
                # Test code fix
                code = """
def calculate_factorial(n):
    if n < 0:
        return "Error: n must be positive"
    result = 0
    for i in range(1, n + 1):
        result *= i
    return result
"""
                suggestion_type = "fix"
                
            elif choice == "3":
                # Test code generation
                code = "Write a Java class to check if a string is a palindrome"
                suggestion_type = "generate"
                
            else:
                print("Invalid choice. Exiting.")
                return
            
            # Create request - NOTE: Changed 'action' to 'type' to match server code
            request_id = f"test-{int(time.time())}"
            request = {
                "id": request_id,
                "type": suggestion_type,
                "code": code
            }
            
            print("\nSending request...")
            print(f"Code: {code.strip() if isinstance(code, str) else code}")
            print(f"Type: {suggestion_type}")
            
            start_time = time.time()
            
            # Send request
            await websocket.send(json.dumps(request))
            
            try:
                # Wait for processing confirmation
                response = await websocket.recv()
                data = json.loads(response)
                
                if data.get("status") == "processing":
                    print("\nRequest accepted, waiting for results...")
                    
                    # Wait for final response
                    response = await websocket.recv()
                    data = json.loads(response)
                    
                    end_time = time.time()
                    
                    if data.get("status") == "success":
                        print("\n=== SUCCESS ===")
                        print(f"Response time: {end_time - start_time:.2f} seconds")
                        print(f"\nSuggestion:\n{data.get('suggestion')}")
                    else:
                        print("\n=== ERROR ===")
                        print(f"Error: {data.get('message')}")
                else:
                    print("\n=== ERROR ===")
                    print(f"Unexpected response: {data}")
            except websockets.exceptions.ConnectionClosedError as e:
                print(f"\n=== CONNECTION ERROR ===")
                print(f"The WebSocket connection was closed unexpectedly: {str(e)}")
                print("This might be due to a server error or timeout.")
    
    except ConnectionRefusedError:
        print("Connection refused. Make sure the WebSocket server is running.")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_websocket_client())