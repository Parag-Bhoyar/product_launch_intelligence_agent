import ollama


def run_launch_agent(product_description: str) -> str:
    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a Product Launch Intelligence Agent. "
                    "Analyze product ideas and provide practical, "
                    "structured launch intelligence."
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
        "Explain what a Product Launch Intelligence Agent does "
        "in one sentence."
    )

    print("\nAI RESPONSE:")
    print(result)