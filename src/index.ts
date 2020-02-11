import * as express from 'express';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import * as helmet from 'helmet';

import Config from './db-config';
import { acceptJsonOnly } from './middlewares/';

const app = express();
app.use(acceptJsonOnly);
app.use(helmet());
app.use(express.json());
app.listen(3000, () => {
  console.log('App listening on port 3000');
});

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


