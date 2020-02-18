import * as dotenv from 'dotenv';
const result = dotenv.config();
if (result.error) throw Error("Missing .env file");

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  isProd: process.env.NODE_ENV == 'production',
  isTest: process.env.NODE_ENV == 'test',
  isDev: !process.env.NODE_ENV || process.env.NODE_ENV == 'development',
};

export default env;