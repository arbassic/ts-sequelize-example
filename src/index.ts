import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import * as helmet from 'helmet';
import Config from './db-config';

const app = express();
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const onListenClbck = (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.log(`Port  ${process.env.PORT} in use, retrying...`);
    setTimeout(() => {
      app.listen(process.env.PORT, onListenClbck);
    }, 1000);
  } else {
    console.log(`App listening on port ${process.env.PORT}`);
  }
};
app.listen(process.env.PORT, onListenClbck);

const sequelize = new Sequelize(Config);

sequelize
  .sync({ force: true })
  .then(results => {
    console.log('sequelize synced');
  })
  .catch(error => {
    console.error('error', error);
  });


// configure routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome!', body: req.body, query: req.query, headers: req.headers["content-type"] });
});


