CREATE TABLE PRODUCT_SUMMARY_TABLE WITH (
  KAFKA_TOPIC = 'PRODUCT_SUMMARY_TABLE',
  PARTITIONS = 1,
  REPLICAS = 1,
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  p.id,
  LATEST_BY_OFFSET(p.name) AS name,
  LATEST_BY_OFFSET(p.slug) AS slug,
  LATEST_BY_OFFSET(short_description) AS short_description,
  LATEST_BY_OFFSET(created_at) AS created_at,
  LATEST_BY_OFFSET(status) AS status,

  LATEST_BY_OFFSET(b.id) AS brand_id,
  LATEST_BY_OFFSET(b.name) AS brand_name,
  LATEST_BY_OFFSET(s.id) AS seller_id,
  LATEST_BY_OFFSET(s.name) AS seller_name

FROM PRODUCT_RAW p
LEFT JOIN BRAND_RAW b ON p.brand_id = b.id
LEFT JOIN SELLER_RAW s ON p.seller_id = s.id
GROUP BY p.id
EMIT CHANGES;
