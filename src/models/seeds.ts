import { User } from './User';
import { UserPrivilege } from './UserPrivilege';
import { ActivityLog } from './ActivityLog';
import { onSyncedCallbacks } from '../db';
import * as bcrypt from 'bcrypt';

const addSeed = async () => {
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

  console.log('seed created', user.name);
  return user;
};

onSyncedCallbacks.push(addSeed);
