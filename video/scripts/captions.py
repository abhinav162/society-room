#!/usr/bin/env python3
"""Word-timed captions: script words (voice.json) timed by whisper.cpp word offsets (words.json), per sentence.
Usage: captions.py  -> writes src/captions.json"""
import json, re, pathlib
root = pathlib.Path(__file__).parent.parent
voice = json.load(open(root / 'voice.json'))
asr = json.load(open(root / 'src' / 'words.json'))
end = re.compile(r'[.?!]["\']?$')
out = {}
for sid, text in voice.items():
    sents = re.split(r'(?<=[.?!])\s+', text.strip())
    ws, cur, groups = asr[sid], [], []
    for w in ws:
        cur.append(w)
        if end.search(w['t']): groups.append(cur); cur = []
    if cur: groups.append(cur)
    if len(groups) != len(sents):  # fall back: whole clip as one sentence
        sents, groups = [text.strip()], [ws]
        print('fallback', sid, len(sents), len(groups))
    res = []
    for s, g in zip(sents, groups):
        toks = s.split()
        a, b = g[0]['a'], g[-1]['b']
        tot = sum(len(t) + 1 for t in toks)
        at = a
        for t in toks:
            d = (b - a) * (len(t) + 1) / tot
            res.append({'t': t, 'a': round(at, 2), 'b': round(at + d, 2)}); at += d
    out[sid] = res
    print(sid, len(res), 'words', res[-1]['b'])
json.dump(out, open(root / 'src' / 'captions.json', 'w'))
