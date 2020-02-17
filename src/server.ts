import * as dotenv from 'dotenv';
const env = dotenv.config();
if (env.error)
  throw Error("Need .env file to start the server");

import * as express from 'express';
import { Request, Response } from 'express';
import * as Session from 'express-session';
import * as SessionStore from 'connect-session-sequelize';
import * as helmet from 'helmet';
import { accessLogger, logger } from './logger';
import { db } from './db';
import './models';
import { usersRouter } from './routes/users';

// create express application and
// configure it with some basic middleware
const app = express();
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use morgan access logger
app.use(accessLogger);

// configure session store and middleware
const SequelizeStore = SessionStore(Session.Store);
const sessionConfig: any = {
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({
    db
  }),
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE_DAYS) * 24 * 60 * 60 * 1000
  },
};
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  sessionConfig.cookie.secure = true;
  sessionConfig.proxy = true;
}
app.use(Session(sessionConfig));

// configure routes
app.all('/', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

app.use('/users', usersRouter);

// configure the "Not found" response 
// and final error handling
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


// everything is set up
// listen on a given port
app.listen(process.env.PORT, () => {
  logger.info(`App listening on port ${process.env.PORT}`);
  
  // from now on express app is running
  // capture uncaught errors and unhandled promises
  process
    .on('uncaughtException', err => {
      logger.error('got uncaughtException', err.stack);
    })
    .on('unhandledRejection', (reason, promise) => {
      logger.error('got unhandledRejection', reason, promise);
    });
});
