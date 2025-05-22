import { StartedMongoDBContainer } from "@testcontainers/mongodb";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";

module.exports = async () => {
  if (global.__POSTGRES_CONTAINER__) {
    await (global.__POSTGRES_CONTAINER__ as StartedPostgreSqlContainer).stop();
  }
  if (global.__MONGO_CONTAINER__) {
    await (global.__MONGO_CONTAINER__ as StartedMongoDBContainer).stop();
  }
};
