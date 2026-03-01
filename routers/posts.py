"""
Posts router — handles post CRUD, feed, likes and comments.
"""
from __future__ import annotations

import uuid
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from models import (
    PostCreate,
    CommentCreate,
    make_post,
    make_comment,
    users_db,
    posts_db,
    likes_db,
    comments_db,
    followers_db,
    following_db,
)

router = APIRouter(tags=["posts"])

VALID_CONTENT_TYPES = {"photo", "status", "video"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_post_or_404(post_id: str) -> dict:
    post = posts_db.get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail=f"Post '{post_id}' not found")
    return post


def _get_user_or_404(user_id: str) -> dict:
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")
    return user


# ---------------------------------------------------------------------------
# Post CRUD
# ---------------------------------------------------------------------------

@router.post("/posts", status_code=201)
def create_post(payload: PostCreate) -> JSONResponse:
    """
    Create a new post.
    Validates that the author user exists and content_type is valid.
    Returns 201 with the created post.
    """
    _get_user_or_404(payload.user_id)

    if payload.content_type not in VALID_CONTENT_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"content_type must be one of {sorted(VALID_CONTENT_TYPES)}",
        )

    post_id = str(uuid.uuid4())
    post = make_post(post_id, payload)
    posts_db[post_id] = post
    likes_db[post_id] = set()
    comments_db[post_id] = []

    return JSONResponse(status_code=201, content=post)


@router.get("/posts/{post_id}", status_code=200)
def get_post(post_id: str) -> dict:
    """Get a single post by ID including like_count and repost_count."""
    return _get_post_or_404(post_id)


@router.get("/feed", status_code=200)
def get_feed(user_id: Optional[str] = Query(default=None)) -> dict:
    """
    Get the post feed.
    - If user_id is provided, return only posts from users that user follows.
    - Otherwise return all posts, newest first.
    """
    if user_id is not None:
        _get_user_or_404(user_id)
        followed = following_db.get(user_id, set())
        feed_posts = [p for p in posts_db.values() if p["user_id"] in followed]
    else:
        feed_posts = list(posts_db.values())

    feed_posts.sort(key=lambda p: p["created_at"], reverse=True)
    return {"posts": feed_posts}


# ---------------------------------------------------------------------------
# Likes
# ---------------------------------------------------------------------------

@router.post("/posts/{post_id}/likes", status_code=200)
def like_post(post_id: str, payload: dict) -> dict:
    """
    Like a post.
    Body: {"user_id": "<user_id>"}
    Idempotent — liking the same post twice has no additional effect.
    Increments like_count on the post.
    """
    user_id: str = payload.get("user_id", "")
    if not user_id:
        raise HTTPException(status_code=422, detail="user_id is required")

    _get_user_or_404(user_id)
    post = _get_post_or_404(post_id)

    post_likes: set = likes_db.setdefault(post_id, set())
    if user_id not in post_likes:
        post_likes.add(user_id)
        post["like_count"] = len(post_likes)

    return {"post_id": post_id, "like_count": post["like_count"]}


@router.delete("/posts/{post_id}/likes", status_code=200)
def unlike_post(post_id: str, user_id: str = Query(...)) -> dict:
    """
    Unlike a post.
    Query param: user_id
    Idempotent — unliking a post you haven't liked is a no-op.
    Decrements like_count on the post.
    """
    _get_user_or_404(user_id)
    post = _get_post_or_404(post_id)

    post_likes: set = likes_db.setdefault(post_id, set())
    if user_id in post_likes:
        post_likes.discard(user_id)
        post["like_count"] = len(post_likes)

    return {"post_id": post_id, "like_count": post["like_count"]}


# ---------------------------------------------------------------------------
# Comments
# ---------------------------------------------------------------------------

@router.post("/posts/{post_id}/comments", status_code=201)
def add_comment(post_id: str, payload: CommentCreate) -> JSONResponse:
    """
    Add a comment to a post.
    Returns 201 with the created comment.
    """
    _get_user_or_404(payload.user_id)
    _get_post_or_404(post_id)

    comment_id = str(uuid.uuid4())
    comment = make_comment(comment_id, post_id, payload)
    comments_db.setdefault(post_id, []).append(comment)

    return JSONResponse(status_code=201, content=comment)


@router.get("/posts/{post_id}/comments", status_code=200)
def get_comments(post_id: str) -> dict:
    """Get all comments on a post, oldest first."""
    _get_post_or_404(post_id)
    return {"post_id": post_id, "comments": comments_db.get(post_id, [])}
