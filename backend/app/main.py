from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.agent.launch_agent import run_launch_agent


app = FastAPI(
    title="Product Launch Intelligence API",
    description="AI-powered product research and launch analysis API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:5177",
        "http://127.0.0.1:5178",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Product Launch Intelligence Agent API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Product Launch Intelligence API",
    }


@app.post("/api/launch/analyze")
def analyze_launch(request: dict):
    product_description = request.get(
        "product_description",
        ""
    ).strip()

    if not product_description:
        return {
            "success": False,
            "message": "Product description is required.",
        }

    analysis = run_launch_agent(product_description)

    return {
        "success": True,
        "product_description": product_description,
        "analysis": analysis,
    }