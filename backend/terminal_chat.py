from app.openai_client import client
from app.prompts import AARYA_SYSTEM_PROMPT

MODEL = "gpt-4o-mini"

def main():
    print("\n=== Aarya Terminal Chat (Memory ON) ===")
    print("Type 'exit' to quit.\n")

    # This stores the full conversation
    messages = [
        {"role": "system", "content": AARYA_SYSTEM_PROMPT}
    ]

    while True:
        user_msg = input("You: ").strip()

        if user_msg.lower() in ["exit", "quit"]:
            print("Aarya: Stay safe. ❤️")
            break

        # Add user message to memory
        messages.append({"role": "user", "content": user_msg})

        # Send full history to OpenAI
        res = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.4,
            max_tokens=350,
        )

        reply = res.choices[0].message.content.strip()

        # Add assistant reply to memory
        messages.append({"role": "assistant", "content": reply})

        print("\nAarya:", reply, "\n")


if __name__ == "__main__":
    main()
