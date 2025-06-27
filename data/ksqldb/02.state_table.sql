CREATE TABLE CATEGORIES_PARENT AS
SELECT * FROM CATEGORIES_RAW
EMIT CHANGES;


CREATE TABLE CATEGORIES_LIST AS
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


CREATE TABLE IMAGE_LIST AS
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


CREATE TABLE PRIMARY_IMAGE_TABLE AS
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


CREATE TABLE REVIEW_AGG AS
SELECT
  product_id AS product_id,
  AVG(rating) AS rating,
  COUNT(*) AS review_count
FROM REVIEW_RAW
GROUP BY product_id;


CREATE TABLE RATING_AGG AS
SELECT
  product_id,
  STRUCT(
    average := AVG(CAST(rating AS DOUBLE)),
    count := COUNT(*),
    distribution := MAP(
      '5' := SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END),
      '4' := SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END),
      '3' := SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END),
      '2' := SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END),
      '1' := SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END)
    )
  ) AS rating
FROM REVIEW_RAW
WHERE rating BETWEEN 1 AND 5
GROUP BY product_id;


CREATE TABLE OPTION_LIST AS
SELECT
  option_group_id,
  COLLECT_LIST(
    STRUCT(
      id := id,
      name := name,
      additional_price := additional_price,
      sku := sku,
      stock := stock,
      display_order := display_order
    )
  ) AS options
FROM OPTION_RAW
GROUP BY option_group_id
EMIT CHANGES;


CREATE TABLE OPTION_AGG AS
SELECT
  og.product_id AS product_id,
  (MAX(STOCK) > 0) AS in_stock,
  COLLECT_LIST(
    STRUCT(
      id := og.id,
      name := og.name,
      display_order := og.display_order,
      options := ol.options
    )
  ) AS option_groups
FROM OPTION_RAW o
LEFT JOIN OPTION_GROUP_RAW og ON og.id = o.option_group_id
LEFT JOIN OPTION_LIST ol ON og.id = ol.option_group_id
GROUP BY og.product_id
EMIT CHANGES;


CREATE TABLE TAG_LIST AS
SELECT
  pt.product_id AS product_id,
  COLLECT_LIST(
    STRUCT(
      id := t.id,
      name := t.name,
      slug:= t.slug
    )
  ) AS tags
FROM PRODUCT_TAGS_RAW pt
LEFT JOIN TAGS_RAW t ON pt.tag_id = t.id
GROUP BY pt.product_id
EMIT CHANGES;

