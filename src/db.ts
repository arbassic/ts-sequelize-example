import { Sequelize } from 'sequelize';
import Config from './db-config';
import { logger } from './logger';

// create an instance of Sequelize that is available for other modules
export const db = new Sequelize(Config);

// synchronization is performed internally in that file
// so to make it possible to trigger more action onSynced
// provide a simple interface - an array of callbacks
export const onSyncedCallbacks = [];

// until there's no top-level async/await make use of IIFE
// to make the code look nicier
(async () => {
  try {
    await db.sync({ force: true });
    logger.info('Sequelize synced');
    onSyncedCallbacks.forEach(clbck => clbck());
    onSyncedCallbacks.length = 0;
  } catch (error) {
    logger.error('Error during Sequelize syncing', error);
  }
})();