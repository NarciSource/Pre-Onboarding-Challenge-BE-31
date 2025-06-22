CREATE STREAM PRODUCT_SUMMARY AS
SELECT
  P.id AS id,
  P.name AS name,
  P.slug AS slug,
  P.short_description AS short_description,
  P.full_description AS full_description,
  P.created_at AS created_at,
  P.updated_at AS updated_at,
  P.status AS status,

  B.id AS brand_id,
  B.name AS brand_name,
  S.id AS seller_id,
  S.name AS seller_name
FROM PRODUCT_RAW P
LEFT JOIN BRAND_RAW B ON P.brand_id = B.id
LEFT JOIN SELLER_RAW S ON P.seller_id = S.id
EMIT CHANGES;


CREATE TABLE PRODUCT_SUMMARY_TABLE WITH (
  KAFKA_TOPIC = 'PRODUCT_SUMMARY_TABLE',
  PARTITIONS = 1,
  REPLICAS = 1,
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  id,
  LATEST_BY_OFFSET(name) AS name,
  LATEST_BY_OFFSET(slug) AS slug,
  LATEST_BY_OFFSET(short_description) AS short_description,
  LATEST_BY_OFFSET(full_description) AS full_description,
  LATEST_BY_OFFSET(created_at) AS created_at,
  LATEST_BY_OFFSET(updated_at) AS updated_at,
  LATEST_BY_OFFSET(status) AS status,

  LATEST_BY_OFFSET(brand_id) AS brand_id,
  LATEST_BY_OFFSET(brand_name) AS brand_name,
  LATEST_BY_OFFSET(seller_id) AS seller_id,
  LATEST_BY_OFFSET(seller_name) AS seller_name
FROM PRODUCT_SUMMARY
GROUP BY id
EMIT CHANGES;
