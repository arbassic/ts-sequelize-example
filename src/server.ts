import * as dotenv from 'dotenv';
dotenv.config();

import { db } from './db';
import * as express from 'express';
import { Request, Response } from 'express';
import * as helmet from 'helmet';
import { accessLogger, logger } from './logger';
import './models';

const app = express();
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(accessLogger);
  
app.listen(process.env.PORT, () => {
  logger.info(`App listening on port ${process.env.PORT}`);
  
  // from now on express app is running
  // capture uncaught errors and unhandled promises
  process
    .on('uncaughtException', err => {
      logger.error('uncaughtException', err.stack);
    })
    .on('unhandledRejection', (reason, promise) => {
      logger.error('unhandledRejection', reason, promise);
    });
});


(async function () {
  try {
    await db.sync({ force: true });
    logger.info('Sequelize synced');
  } catch (error) {
    logger.error('Error during Sequelize syncing', error);
  }
})();


// configure routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome!', body: req.body, query: req.query, headers: req.headers["content-type"] });
});

app.use((req, res, next) => {
  res.status(404);
  next({ output: '404 Not Found' });
});

app.use((err, req: Request, res: Response, next) => {
  res.status(res.statusCode >= 400 ? res.statusCode : 500);
  logger.error({ path: req.path, output: err.output, message: err.message, stack: err.stack, statusCode: res.statusCode });

  const output: any = {
    message: err.output || 'A server error occured'
  };
  if (process.env.NODE_ENV != 'production' && res.statusCode > 404) {
    output.error = err.message;
  };
  if (process.env.NODE_ENV != 'production' && res.statusCode > 404) {
    output.stack = err.stack;
  }

  res.json(output);
});
