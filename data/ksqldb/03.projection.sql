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

  LATEST_BY_OFFSET(STRUCT(id := b.id, name := b.name)) AS brand,
  LATEST_BY_OFFSET(STRUCT(id := s.id, name := s.name)) AS seller,

  LATEST_BY_OFFSET(primary_image) AS primary_image,

  LATEST_BY_OFFSET(r.rating) AS rating,
  LATEST_BY_OFFSET(r.review_count) AS review_count

FROM PRODUCT_RAW p
LEFT JOIN BRAND_RAW b ON p.brand_id = b.id
LEFT JOIN SELLER_RAW s ON p.seller_id = s.id
LEFT JOIN PRIMARY_IMAGE_TABLE pi ON p.id = pi.product_id
LEFT JOIN REVIEW_AGG r ON p.id = r.product_id
GROUP BY p.id
EMIT CHANGES;
