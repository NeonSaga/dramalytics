from fastapi import FastAPI
from routes.users import router as users_router
from routes.auth import router as auth_router
from routes import ratings
from routes import reviews
from routes import watchlist
from routes import progress

app = FastAPI()


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(ratings.router)
app.include_router(reviews.router)
app.include_router(watchlist.router)
app.include_router(progress.router)

@app.get("/")
def home():
    return{"message": "Dramalytics API is running!"}