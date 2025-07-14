rs.initiate({
  _id: "${MONGO_REPLICA_SET}",
  members: [{ _id: 0, host: "${MONGO_HOST}:${MONGO_PORT}" }]
});
