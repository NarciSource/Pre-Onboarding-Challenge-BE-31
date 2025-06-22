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
