CREATE TABLE PRODUCT_SUMMARY WITH (
  KAFKA_TOPIC = 'ksql_view_product_summary',
  PARTITIONS = 1,
  REPLICAS = 1,
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  p.id AS id,
  LATEST_BY_OFFSET(p.name) AS name,
  LATEST_BY_OFFSET(p.slug) AS slug,
  LATEST_BY_OFFSET(short_description) AS short_description,
  LATEST_BY_OFFSET(FROM_UNIXTIME(created_at / 1000)) AS created_at,
  LATEST_BY_OFFSET(FROM_UNIXTIME(updated_at / 1000)) AS updated_at,
  LATEST_BY_OFFSET(status) AS status,

  LATEST_BY_OFFSET(STRUCT("id" := b.id, "name" := b.name)) AS brand,
  LATEST_BY_OFFSET(STRUCT("id" := s.id, "name" := s.name)) AS seller,
  LATEST_BY_OFFSET(categories) AS categories,

  LATEST_BY_OFFSET(primary_image) AS primary_image,

  LATEST_BY_OFFSET(base_price) AS base_price,
  LATEST_BY_OFFSET(sale_price) AS sale_price,
  LATEST_BY_OFFSET(currency) AS currency,

  LATEST_BY_OFFSET(in_stock) AS in_stock,

  LATEST_BY_OFFSET(r.rating) AS rating,
  LATEST_BY_OFFSET(r.review_count) AS review_count

FROM PRODUCT_RAW p
LEFT JOIN BRAND_RAW b ON p.brand_id = b.id
LEFT JOIN SELLER_RAW s ON p.seller_id = s.id
LEFT JOIN NESTED_PRODUCT_CATEGORY pc ON p.id = pc.product_id
LEFT JOIN PRIMARY_IMAGE pi ON p.id = pi.product_id
LEFT JOIN PRODUCT_PRICE_RAW pp ON p.id = pp.product_id
LEFT JOIN REVIEW_AGG r ON p.id = r.product_id
LEFT JOIN OPTION_AGG o ON p.id = o.product_id
GROUP BY p.id
EMIT CHANGES;
