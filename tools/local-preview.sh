#!/bin/bash
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
runtime_root="/Users/rubigondola/.cache/codex-runtimes/codex-primary-runtime/dependencies"
if [ -x "$runtime_root/python/bin/python3" ]; then
  python_bin="$runtime_root/python/bin/python3"
else
  python_bin="$(command -v python3)"
fi
export PATH="$runtime_root/bin/fallback:$runtime_root/node/bin:$PATH"
port="${PORT:-8001}"
echo "Full local game: http://127.0.0.1:$port/games/"
exec "$python_bin" -m http.server "$port" --bind 127.0.0.1 --directory "$repo_root"
