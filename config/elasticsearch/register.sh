#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Registering Elasticsearch index templates..."

for template in $SCRIPT_DIR/templates/*-template.json
do
    name=$(basename "$template" .json)
    echo "Registering template: $name"

    curl -X PUT "http://${ES_HOST}:${ES_PORT}/_index_template/${name}" \
        -H "Content-Type: application/json" \
        -d @"$template" | jq .

    echo
    sleep 2
done
