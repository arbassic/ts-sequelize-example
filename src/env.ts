import * as dotenv from 'dotenv';
const result = dotenv.config();
if (result.error) throw Error("Missing .env file");

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  DB_DATABASE: process.env.DB_DATABASE,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT) || null,

  isProd: process.env.NODE_ENV == 'production',
  isTest: process.env.NODE_ENV == 'test',
  isDev: !process.env.NODE_ENV || process.env.NODE_ENV == 'development',
};

export default env;