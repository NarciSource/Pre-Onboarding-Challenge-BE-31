CREATE TABLE OPTION_LIST WITH (
  KAFKA_TOPIC = 'ksql_state_option_list',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  option_group_id,
  COLLECT_LIST(
    STRUCT(
      "id" := id,
      "name" := name,
      "additional_price" := additional_price,
      "sku" := sku,
      "stock" := stock,
      "display_order" := display_order
    )
  ) AS options
FROM OPTION_RAW
GROUP BY option_group_id
EMIT CHANGES;


CREATE TABLE OPTION_AGG WITH (
  KAFKA_TOPIC = 'ksql_state_option_agg',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  og.product_id AS product_id,
  (MAX(STOCK) > 0) AS in_stock,
  COLLECT_LIST(
    STRUCT(
      "id" := og.id,
      "name" := og.name,
      "display_order" := og.display_order,
      "options" := ol.options
    )
  ) AS option_groups
FROM OPTION_RAW o
LEFT JOIN OPTION_GROUP_RAW og ON og.id = o.option_group_id
LEFT JOIN OPTION_LIST ol ON og.id = ol.option_group_id
GROUP BY og.product_id
EMIT CHANGES;


CREATE TABLE TAG_LIST WITH (
  KAFKA_TOPIC = 'ksql_state_tag_list',
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  pt.product_id AS product_id,
  COLLECT_LIST(
    STRUCT(
      "id" := t.id,
      "name" := t.name,
      "slug":= t.slug
    )
  ) AS tags
FROM PRODUCT_TAGS_RAW pt
LEFT JOIN TAGS_RAW t ON pt.tag_id = t.id
GROUP BY pt.product_id
EMIT CHANGES;

