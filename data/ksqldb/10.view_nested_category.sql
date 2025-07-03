CREATE TABLE NESTED_CATEGORY_LEVEL3 WITH (
  KAFKA_TOPIC = 'ksql_view_nested_category_level_3',
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
WHERE level = 3
GROUP BY id
EMIT CHANGES;


CREATE TABLE CATEGORY_CHILDREN_LEVEL3 WITH (
  KAFKA_TOPIC = 'ksql_state_category_children_level_3',
  KEY_FORMAT = 'JSON',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT 
  parent_id,
  COLLECT_LIST(
    STRUCT(
      "id" := id,
      "name" := name,
      "slug" := slug,
      "description" := description,
      "image_url" := image_url
    )
  ) AS children
FROM NESTED_CATEGORY_LEVEL3
GROUP BY parent_id
EMIT CHANGES;


CREATE TABLE NESTED_CATEGORY_LEVEL2 WITH (
  KAFKA_TOPIC = 'ksql_view_nested_category_level_2',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  id,
  name,
  slug,
  description,
  c.parent_id AS parent_id,
  level,
  image_url,
  children
FROM CATEGORIES_TABLE c
LEFT JOIN CATEGORY_CHILDREN_LEVEL3 children ON c.id = children.parent_id
WHERE level = 2
EMIT CHANGES;


CREATE TABLE CATEGORY_CHILDREN_LEVEL2 WITH (
  KAFKA_TOPIC = 'ksql_state_category_children_level_2',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  parent_id,
  COLLECT_LIST(
    STRUCT(
      "id" := id,
      "name" := name,
      "slug" := slug,
      "description" := description,
      "image_url" := image_url,
      "children" := children
    )
  ) AS children
FROM NESTED_CATEGORY_LEVEL2 c
GROUP BY parent_id
EMIT CHANGES;


CREATE TABLE NESTED_CATEGORY_LEVEL1 WITH (
  KAFKA_TOPIC = 'ksql_view_nested_category_level_1',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  id,
  name,
  slug,
  description,
  image_url,
  level,
  children
FROM CATEGORIES_TABLE c
LEFT JOIN CATEGORY_CHILDREN_LEVEL2 children ON c.id = children.parent_id
WHERE level = 1
EMIT CHANGES;
