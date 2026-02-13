import json
import numpy as np
import sounddevice as sd
from scipy.io.wavfile import write
from playsound import playsound

from app.openai_client import client
from app.prompts import AARYA_SYSTEM_PROMPT

CHAT_MODEL = "gpt-4o-mini"
WHISPER_MODEL = "whisper-1"
TTS_MODEL = "gpt-4o-mini-tts"
VOICE = "alloy"


def record_audio(filename="input.wav", duration=10, fs=16000):
    print("\n🎤 Listening... (speak now)")
    audio = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype=np.int16)
    sd.wait()
    write(filename, fs, audio)
    print("✅ Recorded.\n")


def transcribe_audio(filename="input.wav"):
    with open(filename, "rb") as f:
        result = client.audio.transcriptions.create(
            model=WHISPER_MODEL,
            file=f
        )
    return result.text.strip()


def split_reply_and_actions(raw: str):
    raw = raw.strip()

    # NEW FORMAT
    if "[[ACTIONS]]" in raw:
        if raw.startswith("REPLY:"):
            raw = raw.split("REPLY:", 1)[1].strip()

        reply_part, rest = raw.split("[[ACTIONS]]", 1)
        reply_text = reply_part.strip()

        json_part = rest.split("[[/ACTIONS]]", 1)[0].strip()
        try:
            actions = json.loads(json_part)
        except:
            actions = None

        return reply_text, actions

    # OLD FORMAT
    if "USER_MESSAGE:" in raw:
        raw = raw.split("USER_MESSAGE:", 1)[1].strip()

    if "ACTIONS:" in raw:
        parts = raw.split("ACTIONS:", 1)
        reply_text = parts[0].strip()

        json_part = parts[1].strip()
        try:
            actions = json.loads(json_part)
        except:
            actions = None

        return reply_text, actions

    # fallback
    return raw, None



def speak(text: str, out_file="aarya.mp3"):
    audio = client.audio.speech.create(
        model=TTS_MODEL,
        voice=VOICE,
        input=text
    )

    with open(out_file, "wb") as f:
        f.write(audio.read())

    playsound(out_file)


def main():
    print("\n=== Aarya Terminal Chat (VOICE + TEXT + MEMORY) ===")
    print("How it works:")
    print("  - Press ENTER (empty input) -> speak")
    print("  - Type normally -> text chat")
    print("  - Type 'exit' -> quit\n")

    messages = [{"role": "system", "content": AARYA_SYSTEM_PROMPT}]

    while True:
        user_msg = input("You: ").strip()

        if user_msg.lower() in ["exit", "quit"]:
            print("\nAarya: Stay safe.\n")
            speak("Stay safe.")
            break

        # Voice input if user presses Enter
        if user_msg == "":
            record_audio("input.wav", duration=6)
            user_msg = transcribe_audio("input.wav")
            print("📝 You said:", user_msg)

        # Add user message
        messages.append({"role": "user", "content": user_msg})

        # OpenAI call
        res = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=messages,
            temperature=0.4,
            max_tokens=350,
        )

        raw_reply = res.choices[0].message.content.strip()

        # Store raw assistant reply in memory
        messages.append({"role": "assistant", "content": raw_reply})

        # Extract clean reply + actions
        reply_text, actions = split_reply_and_actions(raw_reply)

        # Extra protection against echo
        if reply_text.lower().strip() == user_msg.lower().strip():
            reply_text = (
                "1) Move to a crowded, well-lit place immediately.\n"
                "2) Call someone you trust and stay on the line.\n"
                "3) Share your live location right now.\n"
                "4) If you feel in danger, call 112 immediately.\n"
                "Are you outside or inside? (Outside/Inside)"
            )

        print("\nAarya:", reply_text, "\n")

        # Speak only the reply
        speak(reply_text)

        # Optional debug
        # if actions:
        #     print("DEBUG ACTIONS:", actions)

if __name__ == "__main__":
    main()
