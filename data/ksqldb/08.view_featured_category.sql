CREATE TABLE FEATURED_CATEGORY WITH (
  KAFKA_TOPIC = 'ksql_view_featured_category',
  PARTITIONS = 1,
  REPLICAS = 1,
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  c.id,
  LATEST_BY_OFFSET(c.name) AS name,
  LATEST_BY_OFFSET(c.slug) AS slug,
  LATEST_BY_OFFSET(c.image_url) AS image_url,
  COUNT(pc.id) as product_count
FROM PRODUCT_CATEGORIES_RAW pc
LEFT JOIN CATEGORIES_TABLE c ON c.id = pc.category_id
GROUP BY c.id
EMIT CHANGES;
