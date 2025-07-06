FROM quay.io/debezium/connect:2.5

USER root
RUN microdnf install -y unzip curl && microdnf clean all

ARG KAFKA_MONGO_VERSION=2.0.0
ARG KAFKA_ELASTICSEARCH_VERSION=15.0.1
ARG KAFKA_TRANSFORM_COMMON_VERSION=0.1.0.54

# MongoDB Sink Connector 설치
RUN curl -L -o /tmp/mongo-sink.zip https://hub-downloads.confluent.io/api/plugins/mongodb/kafka-connect-mongodb/versions/$KAFKA_MONGO_VERSION/mongodb-kafka-connect-mongodb-$KAFKA_MONGO_VERSION.zip \
  && unzip /tmp/mongo-sink.zip -d /tmp/mongo-sink \
  && mkdir -p /kafka/connect/mongodb-sink \
  && cp -r /tmp/mongo-sink/mongodb-kafka-connect-mongodb-$KAFKA_MONGO_VERSION/lib/* /kafka/connect/mongodb-sink/ \
  && rm -rf /tmp/mongo-sink.zip /tmp/mongo-sink

# Elasticsearch Sink Connector 설치
RUN curl -L -o /tmp/es-sink.zip https://hub-downloads.confluent.io/api/plugins/confluentinc/kafka-connect-elasticsearch/versions/$KAFKA_ELASTICSEARCH_VERSION/confluentinc-kafka-connect-elasticsearch-$KAFKA_ELASTICSEARCH_VERSION.zip \
  && unzip /tmp/es-sink.zip -d /tmp/es-sink \
  && mkdir -p /kafka/connect/elasticsearch-sink \
  && cp -r /tmp/es-sink/confluentinc-kafka-connect-elasticsearch-$KAFKA_ELASTICSEARCH_VERSION/lib/* /kafka/connect/elasticsearch-sink/ \
  && rm -rf /tmp/es-sink.zip /tmp/es-sink
  
# 변환 SMT
RUN curl -L -o /tmp/transform-common.zip https://hub-downloads.confluent.io/api/plugins/jcustenborder/kafka-connect-transform-common/versions/$KAFKA_TRANSFORM_COMMON_VERSION/jcustenborder-kafka-connect-transform-common-$KAFKA_TRANSFORM_COMMON_VERSION.zip \
  && unzip /tmp/transform-common.zip -d /tmp/transform-common \
  && mkdir -p /kafka/connect/transform-common \
  && cp -r /tmp/transform-common/jcustenborder-kafka-connect-transform-common-$KAFKA_TRANSFORM_COMMON_VERSION/lib/* /kafka/connect/transform-common/ \
  && rm -rf /tmp/transform-common.zip /tmp/transform-common
