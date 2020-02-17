import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import { Request, Response } from 'express';
import * as helmet from 'helmet';
import { accessLogger, logger } from './logger';
import './models';


// create express application and
// configure it with some basic middleware
const app = express();
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use morgan access logger
app.use(accessLogger);

// configure routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome!', body: req.body, query: req.query, headers: req.headers["content-type"] });
});

// --- temporary test-endpoint
import { User } from './models/User';
import { asyncHandler } from './middlewares/async-handler';
app.get('/users/:userId', asyncHandler( async (req, res) => {
  const userId = parseInt(req.params.userId);
  const password = req.query.password;
  if (!userId || !password) {
    throw Error("No user id or password");
  }
  const user: User = await User.findByPk(userId, { include: ['privileges'] });
  // if (!user) {
  //   throw Error("User not found");
  // }
  // const passwordMatch = await user.checkPassword(password);
  // if (!passwordMatch) {
  //   throw Error("Password doesn't match");
  // }
  res.status(200).json(user);
}));
// --- temporary test-endpoint


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
