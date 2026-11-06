#!/bin/sh
# Install deps and check the local Switch Console stack. Read-only toward Docker.
set -e
cd "$(dirname "$0")/.."
uv sync
scripts/live-check.sh
