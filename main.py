from fastapi import FastAPI
from routes.users import router as users_router

app = FastAPI()

app.include_router(users_router)

@app.get("/")
def home():
    return{"message": "Dramalytics API is running!"}