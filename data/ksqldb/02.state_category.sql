CREATE TABLE CATEGORIES_PARENT WITH (
  KAFKA_TOPIC = 'ksql_state_categories_parent',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT * FROM CATEGORIES_RAW
EMIT CHANGES;


CREATE TABLE CATEGORY_LIST WITH (
  KAFKA_TOPIC = 'ksql_state_category_list',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  product_id,
  COLLECT_LIST(
    STRUCT(
      id := c.id,
      name := c.name,
      slug := c.slug,
      is_primary := pc.is_primary,
      parent := STRUCT(
        id := parent.id,
        name := parent.name,
        slug := parent.slug
      )
    )
  ) AS categories
FROM PRODUCT_CATEGORIES_RAW pc
LEFT JOIN CATEGORIES_RAW c ON c.id = pc.category_id
LEFT JOIN CATEGORIES_PARENT parent ON parent.id = c.parent_id
GROUP BY product_id
EMIT CHANGES;
