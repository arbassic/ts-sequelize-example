
import * as morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';
import * as rfs from 'rotating-file-stream';
import * as winston from 'winston';

// express middleware access logger
const logDirectory = 'logs';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  maxFiles: 14,
  maxSize: '10M',
  path: logDirectory
});
export const accessLogger = morgan('combined', { stream: accessLogStream });


// runtime and errors logger
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'app' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/runtime_combined.log' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}