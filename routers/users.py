"""
Users router — handles user CRUD and follow/unfollow operations.
"""
from __future__ import annotations

import uuid
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from models import (
    UserCreate,
    UserUpdate,
    UserResponse,
    FollowRequest,
    UnfollowRequest,
    make_user,
    users_db,
    followers_db,
    following_db,
)

router = APIRouter(prefix="/users", tags=["users"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_user_or_404(user_id: str) -> dict:
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")
    return user


def _serialize_user(user: dict) -> dict:
    return {
        **user,
        "follower_count": len(followers_db.get(user["id"], set())),
        "following_count": len(following_db.get(user["id"], set())),
    }


# ---------------------------------------------------------------------------
# User CRUD
# ---------------------------------------------------------------------------

@router.post("", status_code=201)
def create_user(payload: UserCreate) -> JSONResponse:
    """Create a new user profile. Returns 201 with the created user."""
    user_id = str(uuid.uuid4())
    user = make_user(user_id, payload)
    users_db[user_id] = user
    followers_db[user_id] = set()
    following_db[user_id] = set()
    return JSONResponse(status_code=201, content=_serialize_user(user))


@router.get("/{user_id}", status_code=200)
def get_user(user_id: str) -> dict:
    """Get a user profile by ID. Returns 404 if not found."""
    user = _get_user_or_404(user_id)
    return _serialize_user(user)


@router.put("/{user_id}", status_code=200)
def update_user(user_id: str, payload: UserUpdate) -> dict:
    """Partial update of a user profile. Only supplied fields are updated."""
    user = _get_user_or_404(user_id)
    updates = payload.model_dump(exclude_unset=True)
    user.update(updates)
    users_db[user_id] = user
    return _serialize_user(user)


# ---------------------------------------------------------------------------
# Follow system
# ---------------------------------------------------------------------------

@router.post("/{user_id}/follow", status_code=200)
def follow_user(user_id: str, payload: FollowRequest) -> dict:
    """
    Follow a user.
    - user_id: the user to follow (target)
    - payload.follower_id: the user who is following
    Returns 404 if either user does not exist, 400 if trying to follow yourself.
    """
    target = _get_user_or_404(user_id)
    follower = _get_user_or_404(payload.follower_id)

    if user_id == payload.follower_id:
        raise HTTPException(status_code=400, detail="A user cannot follow themselves")

    followers_db.setdefault(user_id, set()).add(payload.follower_id)
    following_db.setdefault(payload.follower_id, set()).add(user_id)

    return {"detail": f"User '{payload.follower_id}' is now following '{user_id}'"}


@router.delete("/{user_id}/follow", status_code=200)
def unfollow_user(user_id: str, follower_id: str) -> dict:
    """
    Unfollow a user.
    - user_id: the user to unfollow (target)
    - follower_id: query param — the user who is unfollowing
    Returns 404 if either user does not exist.
    """
    _get_user_or_404(user_id)
    _get_user_or_404(follower_id)

    followers_db.setdefault(user_id, set()).discard(follower_id)
    following_db.setdefault(follower_id, set()).discard(user_id)

    return {"detail": f"User '{follower_id}' has unfollowed '{user_id}'"}


@router.get("/{user_id}/followers", status_code=200)
def get_followers(user_id: str) -> dict:
    """Get the list of user_ids who follow this user."""
    _get_user_or_404(user_id)
    return {"user_id": user_id, "followers": list(followers_db.get(user_id, set()))}


@router.get("/{user_id}/following", status_code=200)
def get_following(user_id: str) -> dict:
    """Get the list of user_ids that this user follows."""
    _get_user_or_404(user_id)
    return {"user_id": user_id, "following": list(following_db.get(user_id, set()))}


# ---------------------------------------------------------------------------
# Posts by user (thin pass-through — avoids circular import)
# ---------------------------------------------------------------------------

@router.get("/{user_id}/posts", status_code=200)
def get_user_posts(user_id: str) -> dict:
    """Get all posts created by a specific user."""
    from models import posts_db  # local import to avoid any circular-import edge cases

    _get_user_or_404(user_id)
    user_posts = [p for p in posts_db.values() if p["user_id"] == user_id]
    user_posts.sort(key=lambda p: p["created_at"], reverse=True)
    return {"user_id": user_id, "posts": user_posts}
