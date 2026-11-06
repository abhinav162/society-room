#!/bin/sh
# Read-only: is the Switch Console local server + Mattermost answering?
set -e
DIR="$HOME/Library/Application Support/switchdash/local-switch-server"
MM=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['mattermost'])" "$DIR/ports.json")
python3 - "$MM" <<'PY'
import sys, urllib.request
port = sys.argv[1]
r = urllib.request.urlopen(f"http://127.0.0.1:{port}/api/v4/system/ping", timeout=5)
print("mattermost", port, r.status)
PY
docker ps --format '{{.Names}}' | grep -q mattermost && echo "mattermost container: up"
