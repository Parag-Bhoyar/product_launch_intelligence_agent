from fastapi import FastAPI

app = FastAPI(
    title="Product Launch Intelligence Agent",
    description="AI-powered product launch intelligence platform",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "message": "Product Launch Intelligence Agent API is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }