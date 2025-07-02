CREATE TABLE PRODUCT_CATALOG WITH (
  KAFKA_TOPIC = 'ksql_view_product_catalog',
  PARTITIONS = 1,
  REPLICAS = 1,
  KEY_FORMAT = 'DELIMITED',
  VALUE_FORMAT = 'AVRO'
) AS
SELECT
  p.id AS id,
  LATEST_BY_OFFSET(p.name) AS name,
  LATEST_BY_OFFSET(p.slug) AS slug,
  LATEST_BY_OFFSET(p.short_description) AS short_description,
  LATEST_BY_OFFSET(p.full_description) AS full_description,
  LATEST_BY_OFFSET(FROM_UNIXTIME(p.created_at / 1000)) AS created_at,
  LATEST_BY_OFFSET(FROM_UNIXTIME(p.updated_at / 1000)) AS updated_at,
  LATEST_BY_OFFSET(p.status) AS status,

  LATEST_BY_OFFSET(
    STRUCT(
      id := b.id,
      name := b.name,
      description := b.description,
      logo_url := b.logo_url,
      website := b.website
    )
  ) AS brand,

  LATEST_BY_OFFSET(
    STRUCT(
      id := s.id,
      name := s.name,
      description := s.description,
      logo_url := s.logo_url,
      rating := s.rating,
      contact_email := s.contact_email,
      contact_phone := s.contact_phone
    )
  ) AS seller,

  LATEST_BY_OFFSET(
    STRUCT(
      weight := weight,
      dimensions := JSON_RECORDS(dimensions),
      materials := materials,
      country_of_origin := country_of_origin,
      warranty_info := warranty_info,
      additional_info := JSON_RECORDS(additional_info)
    )
  ) AS details,

  LATEST_BY_OFFSET(categories) AS categories,

  LATEST_BY_OFFSET(images) AS images,

  LATEST_BY_OFFSET(
    STRUCT(
      base_price := base_price,
      sale_price := sale_price,
      cost_price := cost_price,
      currency := currency,
      tax_rate := tax_rate,
      discount_percentage := ROUND(((base_price - sale_price) / base_price) * 100, 0)
    )
  ) AS price,

  LATEST_BY_OFFSET(r.rating) AS rating,

  LATEST_BY_OFFSET(option_groups) AS option_groups,

  LATEST_BY_OFFSET(tags) AS tags

FROM PRODUCT_RAW p
LEFT JOIN DESCRIPTION_RAW d ON p.id = d.product_id
LEFT JOIN BRAND_RAW b ON p.brand_id = b.id
LEFT JOIN SELLER_RAW s ON p.seller_id = s.id
LEFT JOIN NESTED_PRODUCT_CATEGORY pc ON p.id = pc.product_id
LEFT JOIN IMAGE_LIST il ON p.id = il.product_id
LEFT JOIN PRODUCT_PRICE_RAW pp ON p.id = pp.product_id
LEFT JOIN RATING_AGG r ON p.id = r.product_id
LEFT JOIN OPTION_AGG o ON p.id = o.product_id
LEFT JOIN TAG_LIST t ON p.id = t.product_id
GROUP BY p.id
EMIT CHANGES;
