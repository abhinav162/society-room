#!/usr/bin/env python3
"""Decode a saved PolterTab screenshot result into public/shots/<name>.png. Usage: shot.py <result.txt> <name>"""
import base64, re, sys, pathlib
t = open(sys.argv[1]).read()
m = re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)', t)
out = pathlib.Path(__file__).parent.parent / 'public' / 'shots' / f'{sys.argv[2]}.png'
out.write_bytes(base64.b64decode(m.group(1)))
print(out)
