# Fichier: backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from app.api.v1.endpoints import login, users, attendance, leaves

app = FastAPI(title="Attendance-record API")

# Configuration CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routeurs
app.include_router(login.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(attendance.router, prefix="/api/v1/attendance", tags=["Attendance"])
app.include_router(leaves.router, prefix="/api/v1/leaves", tags=["Leaves"])


@app.get("/")
def read_root():
    return {"message": "Welcome to Attendance-record API"}