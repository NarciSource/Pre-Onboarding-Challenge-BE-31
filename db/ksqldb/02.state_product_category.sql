CREATE TABLE CATEGORIES_TABLE WITH (
  KAFKA_TOPIC = 'ksql_state_category',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  id,
  LATEST_BY_OFFSET(name) AS name,
  LATEST_BY_OFFSET(slug) AS slug,
  LATEST_BY_OFFSET(description) AS description,
  LATEST_BY_OFFSET(parent_id) AS parent_id,
  LATEST_BY_OFFSET(level) AS level,
  LATEST_BY_OFFSET(image_url) AS image_url
FROM CATEGORIES_RAW
GROUP BY id
EMIT CHANGES;


CREATE TABLE CATEGORY_WITH_PARENT WITH (
  KAFKA_TOPIC = 'ksql_state_category_with_parent',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  c.id AS id,
  LATEST_BY_OFFSET(c.name) AS name,
  LATEST_BY_OFFSET(c.slug) AS slug,
  LATEST_BY_OFFSET(c.description) AS description,
  LATEST_BY_OFFSET(c.image_url) AS image_url,
  LATEST_BY_OFFSET(c.parent_id) AS parent_id,
  COLLECT_LIST(
    STRUCT(
      "id" := parent.id,
      "name" := parent.name,
      "slug" := parent.slug,
      "description" := parent.description,
      "image_url" := parent.image_url
    )
  ) AS parent
FROM CATEGORIES_RAW c
LEFT JOIN CATEGORIES_TABLE parent ON c.parent_id = parent.id
GROUP BY c.id
EMIT CHANGES;


CREATE TABLE NESTED_PRODUCT_CATEGORY WITH (
  KAFKA_TOPIC = 'ksql_state_nested_product_category',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  product_id,
  COLLECT_LIST(
    STRUCT(
      "id" := c.id,
      "name" := c.name,
      "slug" := c.slug,
      "is_primary" := pc.is_primary,
      "parent" := parent
    )
  ) AS categories
FROM PRODUCT_CATEGORIES_RAW pc
LEFT JOIN CATEGORIES_TABLE c ON c.id = pc.category_id
LEFT JOIN CATEGORY_WITH_PARENT parent ON parent.id = c.parent_id
GROUP BY product_id
EMIT CHANGES;
