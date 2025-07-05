#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

for connector in \
    $SCRIPT_DIR/source/*-connector.json \
    $SCRIPT_DIR/sink/*-connector.json
do
    echo "Registering $connector"
    envsubst < "$connector" | \
        curl -s -X POST -H "Content-Type: application/json" \
            --data @- "http://${CDC_HOST}:${CDC_PORT}/connectors" | \
        jq .
    echo
    sleep 5
done