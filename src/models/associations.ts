
import { User } from './User';
import { ActivityLog } from './ActivityLog';
import { UserPrivilege } from './UserPrivilege';
import { Company } from './Company';
import './seeds';

// that file is intended to be a central place for all models
export const models = [
  User,
  ActivityLog,
  UserPrivilege,
  Company
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

// user may belong to a company
// each company may have multiple users associated
Company.hasMany(User, {
  foreignKey: 'companyId',
  as: 'users'
});
User.belongsTo(Company, {
  as: 'company'
});
