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


CREATE TABLE OPTION_AGG AS
SELECT
  og.product_id AS product_id,
  (MAX(STOCK) > 0) AS in_stock
FROM OPTION_RAW o
LEFT JOIN OPTION_GROUP_RAW og ON og.id = o.option_group_id
GROUP BY og.product_id
EMIT CHANGES;
