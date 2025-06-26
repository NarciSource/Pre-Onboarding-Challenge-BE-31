CREATE STREAM PRODUCT_RAW WITH (
  KAFKA_TOPIC = 'products-events',
  KEY_FORMAT = 'KAFKA',
  VALUE_FORMAT = 'AVRO'
);


CREATE TABLE BRAND_RAW (
  id BIGINT PRIMARY KEY,
  name STRING,
  slug STRING,
  description STRING,
  logo_url STRING,
  website STRING
) WITH (
  KAFKA_TOPIC = 'brands-events',
  KEY_FORMAT = 'KAFKA',
  VALUE_FORMAT = 'AVRO'
);


CREATE TABLE SELLER_RAW (
  id BIGINT PRIMARY KEY,
  name STRING,
  description STRING,
  logo_url STRING,
  rating STRING,
  contact_email STRING,
  contact_phone STRING
) WITH (
  KAFKA_TOPIC = 'sellers-events',
  KEY_FORMAT = 'KAFKA',
  VALUE_FORMAT = 'AVRO'
);


CREATE STREAM PRODUCT_IMAGE_RAW (
  id BIGINT KEY,
  product_id BIGINT,
  url STRING,
  alt_text STRING,
  is_primary BOOLEAN,
  display_order INT,
  option_id BIGINT
) WITH (
  KAFKA_TOPIC = 'product_images-events',
  KEY_FORMAT = 'KAFKA',
  VALUE_FORMAT = 'AVRO'
);


CREATE STREAM REVIEW_RAW (
  id BIGINT KEY,
  product_id BIGINT,
  rating INT
) WITH (
  KAFKA_TOPIC = 'reviews-events',
  KEY_FORMAT = 'KAFKA',
  VALUE_FORMAT = 'AVRO'
);


CREATE TABLE PRODUCT_PRICE_RAW (
  product_id BIGINT PRIMARY KEY,
  base_price DOUBLE,
  sale_price DOUBLE,
  cost_price DOUBLE,
  currency STRING,
  tax_rate DOUBLE
) WITH (
  KAFKA_TOPIC = 'product_prices-events',
  KEY_FORMAT = 'KAFKA',
  VALUE_FORMAT = 'AVRO'
);


CREATE STREAM OPTION_RAW (
  id BIGINT KEY,
  option_group_id BIGINT,
  name STRING,
  additional_price DOUBLE,
  sku STRING,
  stock INT,
  display_order INT
) WITH (
  KAFKA_TOPIC = 'product_options-events',
  KEY_FORMAT = 'KAFKA',
  VALUE_FORMAT = 'AVRO'
);


CREATE TABLE OPTION_GROUP_RAW (
  id BIGINT PRIMARY KEY,
  product_id BIGINT,
  name STRING,
  display_order INT
) WITH (
  KAFKA_TOPIC = 'product_option_groups-events',
  KEY_FORMAT = 'KAFKA',
  VALUE_FORMAT = 'AVRO'
);
