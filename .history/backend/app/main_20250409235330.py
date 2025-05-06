from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.routers import api
from app.routers import test  # importer le routeur
from app.services.websocket import websocket_endpoint
from app.routers import user_routes 
from app.routers import feedback_routes 

app = FastAPI()

#  Déclare ici les origines autorisées (ton HTML ou ton futur frontend)
origins = [
    "http://localhost",       # Pour un fichier ouvert localement
    "http://127.0.0.1",       # Idem
    "http://localhost:3000",  # frontend(abdou) Next.js plus tard
    "http://127.0.0.1:5500"   # Si tu utilises Live Server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(user_routes.router, prefix="/api")
app.include_router(feedback_routes.router, prefix="/api")

