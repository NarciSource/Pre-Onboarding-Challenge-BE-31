import { MongoDBContainer } from "@testcontainers/mongodb";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

module.exports = async () => {
  // postgres
  const postgres_container = await new PostgreSqlContainer()
    .withDatabase("testdb")
    .withUsername("testuser")
    .withPassword("testpassword")
    .start();

  global.__POSTGRES_CONTAINER__ = postgres_container;
  process.env.TEST_POSTGRES_HOST = postgres_container.getHost();
  process.env.TEST_POSTGRES_PORT = postgres_container.getPort().toString();
  process.env.TEST_POSTGRES_USERNAME = postgres_container.getUsername();
  process.env.TEST_POSTGRES_PASSWORD = postgres_container.getPassword();
  process.env.TEST_POSTGRES_DB = postgres_container.getDatabase();

  // mongo
  const mongo_container = await new MongoDBContainer().start();

  global.__MONGO_CONTAINER__ = mongo_container;
  process.env.TEST_MONGO_URI = mongo_container.getConnectionString();
};
