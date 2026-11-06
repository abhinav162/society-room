#!/usr/bin/env python3
"""OpenAI TTS. usage: tts.py <id|all> [outdir]. Needs OPENAI_API_KEY in env (never printed)."""
import json, os, sys, urllib.request
ids = json.load(open("voice.json"))
out = sys.argv[2] if len(sys.argv) > 2 else "public/audio"
for k in (ids if sys.argv[1] == "all" else [sys.argv[1]]):
    r = urllib.request.Request("https://api.openai.com/v1/audio/speech", method="POST",
        headers={"Authorization": "Bearer " + os.environ["OPENAI_API_KEY"], "Content-Type": "application/json"},
        data=json.dumps({"model": "gpt-4o-mini-tts", "voice": "onyx", "input": ids[k], "response_format": "mp3",
                         "instructions": "Calm, clear documentary narrator. Steady pace."}).encode())
    open(f"{out}/{k}.mp3", "wb").write(urllib.request.urlopen(r).read())
    print("wrote", k)
