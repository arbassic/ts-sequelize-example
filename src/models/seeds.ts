import { User } from './User';
import { UserPrivilege, UserPrivilegeTypes } from './UserPrivilege';
import { ActivityLog } from './ActivityLog';
import { onSyncedCallbacks } from '../db';
import * as bcrypt from 'bcrypt';
import app from 'server';
import { Company } from './Company';

const addSeed = async () => {

  // create superadmin with password and no parent-company
  let passwordHash = await bcrypt.hash('abc', 10);
  const superadmin: User = await User.create({
    name: 'Superadmin',
    passwordHash
  });

  await UserPrivilege.create({
    userId: superadmin.id,
    name: UserPrivilegeTypes.superadmin
  });


  // create sample company and its sample users - owner and a regular worker
  const company: Company = await Company.create({
    name: 'Brave Jackals'
  });

  passwordHash = await bcrypt.hash('manager-pass', 10);
  const owner: User = await User.create({
    name: 'Owner',
    passwordHash,
    companyId: company.id
  });

  await UserPrivilege.create({
    userId: owner.id,
    name: UserPrivilegeTypes.manager
  });

  passwordHash = await bcrypt.hash('regular-pass', 10);
  const regular: User = await User.create({
    name: 'Worker',
    passwordHash,
    companyId: company.id
  });

  await UserPrivilege.create({
    userId: regular.id,
    name: UserPrivilegeTypes.regular // this shouldn't be necessary
  });

  app.emit('app launched');
};

onSyncedCallbacks.push(addSeed);
