"""
Tests for Instagram App - Users, Posts, Feed, Follow, Likes, Comments.

Uses FastAPI TestClient with in-memory storage.
Clears storage between tests to ensure isolation.
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_storage():
    """Clear all in-memory storage before each test."""
    from models import (
        users_db, posts_db, followers_db, following_db,
        likes_db, comments_db, messages_db, group_chats_db
    )
    users_db.clear()
    posts_db.clear()
    followers_db.clear()
    following_db.clear()
    likes_db.clear()
    comments_db.clear()
    messages_db.clear()
    group_chats_db.clear()


# ============================================================================
# USER CRUD TESTS
# ============================================================================

class TestUserCRUD:
    """Test user creation, retrieval, and updates."""

    def test_create_user_success(self):
        """Create a new user returns 201 with user data."""
        payload = {
            "username": "alice",
            "display_name": "Alice Wonder",
            "bio": "A curious explorer",
            "profile_picture_url": "http://example.com/alice.jpg"
        }
        response = client.post("/users", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "alice"
        assert data["display_name"] == "Alice Wonder"
        assert data["bio"] == "A curious explorer"
        assert "user_id" in data

    def test_create_user_minimal(self):
        """Create user with minimal fields."""
        payload = {
            "username": "bob",
            "display_name": "Bob Builder"
        }
        response = client.post("/users", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "bob"
        assert data["display_name"] == "Bob Builder"

    def test_get_user_success(self):
        """Retrieve an existing user returns 200."""
        # Create user first
        create_response = client.post("/users", json={
            "username": "charlie",
            "display_name": "Charlie Brown",
            "bio": "Good grief",
            "profile_picture_url": "http://example.com/charlie.jpg"
        })
        user_id = create_response.json()["user_id"]

        # Get the user
        response = client.get(f"/users/{user_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == user_id
        assert data["username"] == "charlie"
        assert data["display_name"] == "Charlie Brown"
        assert data["bio"] == "Good grief"

    def test_get_nonexistent_user(self):
        """Get a non-existent user returns 404."""
        response = client.get("/users/nonexistent_user_id")
        assert response.status_code == 404

    def test_update_user_success(self):
        """Update user profile returns 200."""
        # Create user
        create_response = client.post("/users", json={
            "username": "david",
            "display_name": "David Smith",
            "bio": "Original bio"
        })
        user_id = create_response.json()["user_id"]

        # Update user
        update_payload = {
            "display_name": "David S.",
            "bio": "Updated bio"
        }
        response = client.put(f"/users/{user_id}", json=update_payload)
        assert response.status_code == 200
        data = response.json()
        assert data["display_name"] == "David S."
        assert data["bio"] == "Updated bio"

    def test_update_nonexistent_user(self):
        """Update non-existent user returns 404."""
        response = client.put("/users/nonexistent_id", json={"display_name": "New Name"})
        assert response.status_code == 404


# ============================================================================
# POST CRUD TESTS
# ============================================================================

class TestPostCRUD:
    """Test post creation, retrieval, and queries."""

    def test_create_post_success(self):
        """Create a new post returns 201."""
        # Create user first
        user_response = client.post("/users", json={
            "username": "poster",
            "display_name": "Post Master"
        })
        user_id = user_response.json()["user_id"]

        # Create post
        payload = {
            "user_id": user_id,
            "content_type": "photo",
            "content_url": "http://example.com/photo1.jpg",
            "caption": "My first post!"
        }
        response = client.post("/posts", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == user_id
        assert data["content_type"] == "photo"
        assert data["caption"] == "My first post!"
        assert "post_id" in data

    def test_get_post_success(self):
        """Retrieve an existing post returns 200."""
        # Setup: create user and post
        user_response = client.post("/users", json={
            "username": "eve",
            "display_name": "Eve"
        })
        user_id = user_response.json()["user_id"]

        post_response = client.post("/posts", json={
            "user_id": user_id,
            "content_type": "status",
            "content_url": "http://example.com/status.txt",
            "caption": "Hello world"
        })
        post_id = post_response.json()["post_id"]

        # Get the post
        response = client.get(f"/posts/{post_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["post_id"] == post_id
        assert data["user_id"] == user_id
        assert data["caption"] == "Hello world"

    def test_get_nonexistent_post(self):
        """Get non-existent post returns 404."""
        response = client.get("/posts/nonexistent_post_id")
        assert response.status_code == 404

    def test_get_posts_by_user(self):
        """Get all posts by a user returns 200 with list."""
        # Create user
        user_response = client.post("/users", json={
            "username": "frank",
            "display_name": "Frank"
        })
        user_id = user_response.json()["user_id"]

        # Create multiple posts
        for i in range(3):
            client.post("/posts", json={
                "user_id": user_id,
                "content_type": "photo",
                "content_url": f"http://example.com/photo{i}.jpg",
                "caption": f"Post {i}"
            })

        # Get posts by user
        response = client.get(f"/users/{user_id}/posts")
        assert response.status_code == 200
        posts = response.json()
        assert len(posts) == 3
        for post in posts:
            assert post["user_id"] == user_id

    def test_get_posts_by_nonexistent_user(self):
        """Get posts for non-existent user returns 404 or empty list."""
        response = client.get("/users/nonexistent_user/posts")
        # Could be 404 or [] depending on implementation
        assert response.status_code in [200, 404]


# ============================================================================
# FEED TESTS
# ============================================================================

class TestFeed:
    """Test feed functionality with filtering and following."""

    def test_feed_empty(self):
        """Feed with no posts returns empty list."""
        response = client.get("/feed")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_feed_with_multiple_posts(self):
        """Feed returns all posts from all users."""
        # Create multiple users and posts
        user_ids = []
        for i in range(2):
            user_response = client.post("/users", json={
                "username": f"user{i}",
                "display_name": f"User {i}"
            })
            user_ids.append(user_response.json()["user_id"])

        post_ids = []
        for user_id in user_ids:
            for j in range(2):
                post_response = client.post("/posts", json={
                    "user_id": user_id,
                    "content_type": "photo",
                    "content_url": f"http://example.com/photo_{user_id}_{j}.jpg",
                    "caption": f"User {user_id} post {j}"
                })
                post_ids.append(post_response.json()["post_id"])

        # Get feed - should have all 4 posts
        response = client.get("/feed")
        assert response.status_code == 200
        posts = response.json()
        assert len(posts) == 4

    def test_feed_with_user_id_filter(self):
        """Feed filtered by user_id returns only that user's posts."""
        # Create user with posts
        user_response = client.post("/users", json={
            "username": "filteruser",
            "display_name": "Filter User"
        })
        user_id = user_response.json()["user_id"]

        # Create posts for this user
        for i in range(3):
            client.post("/posts", json={
                "user_id": user_id,
                "content_type": "photo",
                "content_url": f"http://example.com/photo{i}.jpg",
                "caption": f"Post {i}"
            })

        # Get filtered feed
        response = client.get(f"/feed?user_id={user_id}")
        assert response.status_code == 200
        posts = response.json()
        assert len(posts) == 3
        for post in posts:
            assert post["user_id"] == user_id
