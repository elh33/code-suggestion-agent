@echo off
REM filepath: /c:/Users/Marouane/Desktop/MyCode/python/code-suggestion-agent/start_websocket_service.bat
REM Batch file to start the WebSocket service
echo Starting Code Suggestion WebSocket Service...
cd /d "%~dp0"
python -m ai.service.main --host localhost --port 8001
pause