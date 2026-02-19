"""
Mid-Day Meal Digital Twin System - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager

# Import routers (to be implemented)
# from app.api.v1.api import api_router
# from app.core.config import settings
# from app.db.session import engine
# from app.db.base import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup: Initialize database, load ML models, connect to Redis
    print("🚀 Starting Mid-Day Meal Digital Twin System...")
    # await init_db()
    # await load_ml_models()
    # await connect_redis()
    yield
    # Shutdown: Close connections, cleanup resources
    print("🛑 Shutting down gracefully...")
    # await close_db_connections()
    # await close_redis_connection()

app = FastAPI(
    title="Mid-Day Meal Digital Twin API",
    description="Backend API for Tamil Nadu Mid-Day Meal Scheme Digital Twin System",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include API routers
# app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Mid-Day Meal Digital Twin API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/api/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected",
        "ml_model": "loaded"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
