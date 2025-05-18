set -a
source .env
set +a
cd "$(dirname "$0")"

for connector in \
    postgres-brand-connector.json \
    postgres-category-connector.json \
    postgres-product-connector.json \
    postgres-product-option-connector.json \
    postgres-seller-connector.json \
    postgres-tag-connector.json
do
    envsubst < "$connector" | \
    curl -X POST -H "Content-Type: application/json" --data @- http://localhost:${CDC_PORT}/connectors
done
