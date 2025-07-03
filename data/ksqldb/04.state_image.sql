CREATE TABLE IMAGE_LIST WITH (
  KAFKA_TOPIC = 'ksql_state_image_list',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  product_id,
  COLLECT_LIST(
    STRUCT(
      id := id,
      url := url,
      alt_text := alt_text,
      is_primary := is_primary,
      display_order := display_order,
      option_id := option_id
    )
  ) AS images
FROM PRODUCT_IMAGE_RAW
GROUP BY product_id
EMIT CHANGES;


CREATE TABLE PRIMARY_IMAGE WITH (
  KAFKA_TOPIC = 'ksql_state_primary_image',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  product_id,
  LATEST_BY_OFFSET(
    STRUCT(
      url := url,
      alt_text := alt_text
    )
  ) AS primary_image
FROM PRODUCT_IMAGE_RAW
WHERE is_primary = true
GROUP BY product_id
EMIT CHANGES;
