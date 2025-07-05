FROM quay.io/debezium/connect:2.5

USER root
RUN microdnf install -y unzip curl && microdnf clean all

ARG KAFKA_MONGO_VERSION=2.0.0

# MongoDB Sink Connector 설치
RUN curl -L -o /tmp/mongo-sink.zip https://hub-downloads.confluent.io/api/plugins/mongodb/kafka-connect-mongodb/versions/$KAFKA_MONGO_VERSION/mongodb-kafka-connect-mongodb-$KAFKA_MONGO_VERSION.zip \
  && unzip /tmp/mongo-sink.zip -d /tmp/mongo-sink \
  && mkdir -p /kafka/connect/mongodb-sink \
  && cp -r /tmp/mongo-sink/mongodb-kafka-connect-mongodb-$KAFKA_MONGO_VERSION/lib/* /kafka/connect/mongodb-sink/ \
  && rm -rf /tmp/mongo-sink.zip /tmp/mongo-sink
