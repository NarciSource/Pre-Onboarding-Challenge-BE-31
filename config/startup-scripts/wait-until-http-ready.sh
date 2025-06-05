#!/bin/bash
set -e

HOST="$1"          # e.g., http://elasticsearch:9200
TIMEOUT="${2:-60}" # Default timeout 60 seconds
INTERVAL="${3:-3}" # Default interval 3 seconds

shift 3
CMD="$@"

if [ -z "$HOST" ] || [ -z "$CMD" ]; then
  echo "Usage: $0 <http-url> <timeout> <interval> <command...>"
  exit 1
fi

echo "Checking $HOST until it responds..."

elapsed=0

while true; do
  if curl -s "$HOST" >/dev/null; then
    echo "$HOST is ready!"
    break
  fi
  sleep "$INTERVAL"
  elapsed=$((elapsed + INTERVAL))
  if [ "$elapsed" -ge "$TIMEOUT" ]; then
    echo "Timeout after $TIMEOUT seconds waiting for $HOST"
    exit 1
  fi
  echo "Still waiting for $HOST... ($elapsed/$TIMEOUT)"
done

exec $CMD
