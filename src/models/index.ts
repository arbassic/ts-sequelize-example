
import { User } from './User';
import { ActivityLog } from './ActivityLog';
import { UserPrivilege } from './UserPrivilege';
import './seeds';

// that file is intended to be a central place for all models
export const models = [
  User,
  ActivityLog,
  UserPrivilege
];


// Here is the place to configure
// relationships between models
User.hasMany(UserPrivilege, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'privileges'
});

// add userId to ActivityLog constraint
User.hasMany(ActivityLog, {
  foreignKey: 'userId',
  as: 'activityLogs'
});
