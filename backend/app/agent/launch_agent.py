import os
import json

import ollama
from dotenv import load_dotenv
from firecrawl import FirecrawlApp

load_dotenv()


def research_product(product_description: str) -> str:
    api_key = os.getenv("FIRECRAWL_API_KEY")

    if not api_key:
        raise RuntimeError("FIRECRAWL_API_KEY not found")

    firecrawl = FirecrawlApp(api_key=api_key)

    result = firecrawl.search(
        query=product_description,
        limit=5,
    )

    research = []

    for item in result.web:
        research.append(str(item))

    return "\n\n".join(research)


def run_launch_agent(product_description: str) -> dict:
    research = research_product(product_description)

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "system",
                "content": """
You are a Product Launch Intelligence Agent.

Analyze the product idea using the provided web research.

Important rules:

- Do not invent precise statistics or facts.
- Clearly distinguish research-based information from recommendations.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not put JSON inside code blocks.

Return exactly this structure:

{
  "product_overview": "string",
  "target_market": ["string"],
  "customer_segments": ["string"],
  "market_opportunity": "string",
  "competitors": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  "unique_value_proposition": ["string"],
  "launch_strategy": ["string"],
  "marketing_channels": ["string"],
  "key_risks": ["string"],
  "recommendations": ["string"],
  "launch_readiness_score": 0,
  "launch_verdict": "Needs Validation"
}

Launch readiness score:

- 80 to 100 = Ready
- 60 to 79 = Needs Validation
- 0 to 59 = High Risk

The verdict must match the score.

Choose exactly one verdict:

- Ready
- Needs Validation
- High Risk
""",
            },
            {
                "role": "user",
                "content": (
                    f"PRODUCT IDEA:\n{product_description}\n\n"
                    f"WEB RESEARCH:\n{research}"
                ),
            },
        ],
    )

    content = response["message"]["content"]

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise RuntimeError(
            "The AI returned invalid JSON. Please try again."
        )


if __name__ == "__main__":
    result = run_launch_agent(
        "A smart reusable water bottle that tracks daily water intake "
        "and reminds users to drink water."
    )

    print("\nAI RESPONSE:")
    print(json.dumps(result, indent=2))