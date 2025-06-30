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
