import { Dialect, Options } from "sequelize";

const Config: Options = {
  database: "sequelize_test_db",
  username: "root",
  password: null,
  host: "localhost",
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
  // logging: false
};

export default Config;
