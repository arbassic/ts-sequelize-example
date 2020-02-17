
import * as morgan from 'morgan';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import env from 'env';
const { format } = winston;

const loggerForMorgan = winston.createLogger({
  level: 'info',
  format: format.simple(),
  transports: [
    new DailyRotateFile({ filename: 'logs/access_%DATE%.log', maxSize: '20m', maxFiles: '14d' }),
  ]
});

const winstonStream = {
  write: (message: string, encoding) => {
    loggerForMorgan.info(message);
  }
};
export const accessLogger = morgan('combined', { stream: winstonStream });


// runtime and errors logger
export const logger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json()
  ),
  defaultMeta: { service: 'app' },
  transports: [
    new DailyRotateFile({ filename: 'logs/errors_%DATE%.log', level: 'error', maxSize: '20m', maxFiles: '14d' }),
    new DailyRotateFile({ filename: 'logs/combined_%DATE%.log', maxSize: '20m', maxFiles: '14d' })
  ]
});

// in development mode put all messages to console 
if (env.isDev) {
  logger.add(new winston.transports.Console({
    format: format.prettyPrint({
      depth: 1,
      colorize: true
    })
  }));
}