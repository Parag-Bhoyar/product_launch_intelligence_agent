import ollama


def run_launch_agent(product_description: str) -> str:
    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a Product Launch Intelligence Agent. "
                    "Analyze the given product idea and provide practical, "
                    "structured launch intelligence.\n\n"
                    "Your response must contain these sections:\n"
                    "1. Product Overview\n"
                    "2. Target Market\n"
                    "3. Customer Segments\n"
                    "4. Market Opportunity\n"
                    "5. Competitor Considerations\n"
                    "6. Unique Value Proposition\n"
                    "7. Launch Strategy\n"
                    "8. Marketing Channels\n"
                    "9. Key Risks\n"
                    "10. Recommendations\n\n"
                    "Be practical and specific. "
                    "Do not invent precise statistics or facts. "
                    "If information is unavailable, clearly say so."
                ),
            },
            {
                "role": "user",
                "content": product_description,
            },
        ],
    )

    return response["message"]["content"]


if __name__ == "__main__":
    result = run_launch_agent(
        "A smart reusable water bottle that tracks daily water intake "
        "and reminds users to drink water."
    )

    print("\nAI RESPONSE:")
    print(result)