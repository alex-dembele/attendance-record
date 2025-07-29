# Fichier: backend/app/main.py
from app.api.v1.endpoints import attendance, login, users
from fastapi import FastAPI

app = FastAPI(title="Attendance-record API")

# Inclure le routeur de login
app.include_router(login.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(attendance.router, prefix="/api/v1/attendance", tags=["Attendance"])


@app.get("/")
def read_root():
    return {"message": "Welcome to Attendance-record API"}
