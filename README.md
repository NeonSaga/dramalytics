# Dramalytics [Learning Project]

A full-stack drama discovery and tracking application.

Dramalytics lets users discover dramas, maintain a personal watchlist,
rate dramas, and share reviews with the community.

## Features

- 🔎 Search and discover dramas
- 🌏 Country-based filtering
- 📺 Personal watchlist
- 📊 Watchlist status tracking
- ⭐ 1–10 drama ratings
- 💬 Community reviews
- ✏️ Edit and delete your own reviews
- 🔐 JWT authentication
- 🗄️ PostgreSQL database
- 🔌 External drama API integration

## Tech Stack

### Backend
- Python
- FastAPI
- PostgreSQL
- JWT
- psycopg

### Frontend (Completely by AI)
- React
- React Router
- Axios
- Tailwind CSS
- Vite

### Tools
- Git & GitHub
- Docker

## Architecture
DRAMALYTICS

## Architecture

```text
                    DRAMALYTICS
                         |
                         v
                       USER
                         |
                         v
                  WEB INTERFACE
                         |
                         v
                  FASTAPI BACKEND
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
   AUTHENTICATION   APPLICATION    EXTERNAL DRAMA
                    SERVICES            API
                         |
                         v
                    POSTGRESQL
                         |
       +-----------------+-----------------+
       |                 |                 |
       v                 v                 v
     USERS            DRAMAS          WATCHLIST
                                          
                         |
              +----------+----------+
              |                     |
              v                     v
           RATINGS               REVIEWS
```

Users can create an account, log in, and access
user-specific features.

Watchlist

Users can add dramas to their watchlist and track them as:

Watching
Completed
Plan to Watch
Dropped
Ratings

Users can rate dramas from 1–10 and update or delete
their own ratings.

Reviews

Users can write reviews and manage their own reviews.

AI tools were used during development as a learning and
development aid.

What I Learned

This project was primarily built as a learning experience.

Some of the concepts I worked with include:

Designing relational database schemas
Working with PostgreSQL
Creating REST APIs with FastAPI
Connecting backend services to a database
Implementing JWT authentication
Handling CRUD operations
Using foreign keys and unique constraints
Connecting an application to an external API
Managing frontend/backend communication
Handling authenticated user-specific data
Using Git and GitHub
Understanding Docker 

The project also taught me an important part of software development that isn't visible in tutorials: integrating multiple systems and debugging when those systems don't behave as expected.

I used AI assistance for:

Understanding unfamiliar concepts
Debugging errors
Reviewing implementation approaches
Getting help when stuck
Generating and modifying some code

The project was tested and integrated manually during development.

Status

v1.0 — Completed learning project

Future Improvements:

Automated testing
Better recommendations
Improved caching
More user profile features
Production deployment
Expanded CI/CD
Author

Prakhar

Built as a personal backend-focused development project.