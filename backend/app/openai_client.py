import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

api_key = os.getenv("OPENAI_API_KEY")
print("USING .env FROM:", ENV_PATH)
print("KEY LOADED:", api_key[:15], api_key[-6:])

client = OpenAI(api_key=api_key)
