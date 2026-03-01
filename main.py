"""
Instagram-like REST API — entry point.
Run with: uvicorn main:app --reload
"""
from fastapi import FastAPI

from routers import users, posts

app = FastAPI(
    title="Simple Instagram API",
    description="A simple Instagram-like REST API with users, posts, follow system, likes, comments, reposts and direct messages.",
    version="1.0.0",
)

# Core routers (always available)
app.include_router(users.router)
app.include_router(posts.router)

# Optional routers — gracefully skipped if files don't exist yet
try:
    from routers import repost, messages
    app.include_router(repost.router)
    app.include_router(messages.router)
except ImportError:
    pass


@app.get("/", tags=["health"])
def health_check() -> dict:
    """Simple health-check endpoint."""
    return {"status": "ok", "service": "Instagram API"}
