import { User } from './User';
import { UserPrivilege } from './UserPrivilege';
import { ActivityLog } from './ActivityLog';
import { onSyncedCallbacks } from '../db';
import * as bcrypt from 'bcrypt';
import app from 'server';

const addSeed = async () => {
  app.emit('app synced');

  const passwordHash = await bcrypt.hash('abc', 10);
  const user: User = await User.create({
    name: 'Superadmin 1',
    passwordHash, 
  });

  await UserPrivilege.create({
    userId: user.id,
    name: 'superadmin'
  });
  await UserPrivilege.create({
    userId: user.id,
    name: 'finance'
  });
  await UserPrivilege.create({
    userId: user.id,
    name: 'manager'
  });
  await UserPrivilege.create({
    userId: user.id,
    name: 'worker'
  });

  await ActivityLog.create({
    userId: user.id,
    activityType: 'info',
    params: '1,2,3'
  });

  app.emit('app launched', user);
  return user;
};

onSyncedCallbacks.push(addSeed);
