from fastapi import FastAPI
from routes.users import router as users_router
from routes.auth import router as auth_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(users_router)

@app.get("/")
def home():
    return{"message": "Dramalytics API is running!"}