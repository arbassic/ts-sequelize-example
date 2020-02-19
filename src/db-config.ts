import { Dialect, Options } from "sequelize";
import { logger } from "logger";
import env from "env";

const Config: Options = {
  database: env.DB_DATABASE,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "mariadb" as Dialect,
  dialectOptions: {
    timezone: process.env.db_timezone
  },
  pool: {
    min: 0,
    max: 2,
    idle: 10000
  },
  define: {
    // timestamps: false
  },
  // benchmark: false,
  logging: msg => logger.debug(msg)
};

export default Config;
