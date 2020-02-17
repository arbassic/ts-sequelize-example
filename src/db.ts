import { Sequelize } from 'sequelize';
import Config from './db-config';

export const db = new Sequelize(Config);
