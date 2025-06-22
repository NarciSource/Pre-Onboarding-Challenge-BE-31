SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

for connector in \
    postgres-merchant-connector.json \
    postgres-category-connector.json \
    postgres-product-connector.json \
    postgres-product-option-connector.json \
    postgres-review-connector.json \
    postgres-tag-connector.json \
    mongo-summary-connector.json
do
    echo "Registering $connector"
    envsubst < "$SCRIPT_DIR/$connector" | \
        curl -s -X POST -H "Content-Type: application/json" \
            --data @- "http://${CDC_HOST}:${CDC_PORT}/connectors" | \
        jq .
    echo
    sleep 5
done