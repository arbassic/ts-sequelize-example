import env from 'env';
import * as fs from 'fs';
import * as express from 'express';
import { Request, Response } from 'express';
import * as Session from 'express-session';
import * as SessionStore from 'connect-session-sequelize';
import * as helmet from 'helmet';
import { accessLogger, logger } from './logger';
import { db } from './db';
import './models/associations';
import { usersRouter } from './routes/users-router';
import * as swaggerUi from 'swagger-ui-express';

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
  store: new SequelizeStore({ db }),
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE_DAYS) * 24 * 60 * 60 * 1000
  },
};
if (env.isProd) {
  app.set('trust proxy', 1);
  sessionConfig.cookie.secure = true;
  sessionConfig.proxy = true;
}
app.use(Session(sessionConfig));

// routes
// hello world
app.all('/', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// configure swagger
app.use('/api-docs', swaggerUi.serve);
const swaggerDocument = JSON.parse(fs.readFileSync(__dirname + '/../swagger.json', 'utf8'));
app.get('/api-docs', swaggerUi.setup(swaggerDocument, { explorer: true }));

// configure sub-routes
app.use('/users', usersRouter);

// configure the "Not found" response 
// and final error handling
app.use((req, res, next) => {
  res.status(404);
  next({ output: '404 Not Found' });
});

app.use((err, req: Request, res: Response, next) => {
  if (!res.headersSent) {
    res.status(res.statusCode >= 400 ? res.statusCode : 500);
    const output: any = {
      message: err.output || 'A server error occured'
    };
    if (!env.isProd && res.statusCode > 404) {
      output.error = err.message;
    };
    if (!env.isProd && res.statusCode > 404) {
      output.stack = err.stack;
    }

    res.json(output);
  }
  logger.error(err.message || 'Got server error', {
    path: req.path,
    output: err.output,
    message: err.message,
    stack: err.stack,
    statusCode: res.statusCode
  });

});


// listen at a given port
app.listen(env.APP_PORT, () => {
  logger.info(`App listening on port ${env.APP_PORT}`);
  
  // from now on express app is running
  // in production mode: capture uncaught errors and unhandled promises
  // otherwise: let the errors stop the app
  if (env.isProd) {
    process
      .on('uncaughtException', err => {
        logger.error('got uncaughtException', {
          error: err.message,
          stack: err.stack
        });
      })
      .on('unhandledRejection', (reason, promise) => {
        logger.error('got unhandledRejection', {
          reason,
          promise
        });
      });
  }
});

export default app;