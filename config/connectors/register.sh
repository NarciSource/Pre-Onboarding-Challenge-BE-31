SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

for connector in \
    postgres-merchant-connector.json \
    postgres-category-connector.json \
    postgres-product-connector.json \
    postgres-product-option-connector.json \
    postgres-tag-connector.json
do
    envsubst < "$SCRIPT_DIR/$connector" | \
    curl -X POST -H "Content-Type: application/json" --data @- http://${CDC_HOST}:${CDC_PORT}/connectors
done