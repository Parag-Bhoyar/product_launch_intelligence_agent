from fastapi import APIRouter
from pydantic import BaseModel

from backend.app.agent.launch_agent import run_launch_agent

router = APIRouter(
    prefix="/api/launch",
    tags=["Launch Intelligence"],
)


class LaunchRequest(BaseModel):
    product_description: str


@router.post("/analyze")
def analyze_launch(request: LaunchRequest):
    result = run_launch_agent(request.product_description)

    return {
        "success": True,
        "product_description": request.product_description,
        "analysis": result,
    }