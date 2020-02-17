
import * as morgan from 'morgan';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
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
  level: 'info',
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



// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: format.prettyPrint({
      depth: 1,
      colorize: true
    })
  }));
}