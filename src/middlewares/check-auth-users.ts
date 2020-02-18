import asyncHandler = require("express-async-handler");
import { NextFunction } from "express";
import { UserPrivilegeTypes } from "models/UserPrivilege";
import { User } from "models/User";
import env from "env";

const checkAuthUserManagement = asyncHandler(async (req, res, next: NextFunction) => {

  const userId = req.params.userId || req.query.userId;
  if (!req.params.userId) {
    throw Error("No userId in params or query");
  }
  if (!req.session || !req.session.privileges) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  
  let authed = req.session.privileges.includes(UserPrivilegeTypes.superadmin);
  let userCompanyId: number;
  if (!authed && req.session.privileges.includes(UserPrivilegeTypes.manager)) {

    if (!req.session.companyId) {
      return res.status(401).json({ message: `Session has no company` });
    }

    // the user is manager
    // check if the user about to edit belongs to the same company
    const user: User = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: `User not found` });

    userCompanyId = user.companyId;

    if (userCompanyId == req.session.companyId) {
      // grant access
      next();
      return;
    }
  }

  
  if (!authed) {
    const output: any = { message: 'Unauthorized' };
    if (!env.isProd) {
      output.userCompanyId = userCompanyId;
      output.hasCompanyId = req.session.companyId;
      output.has = req.session.privileges;
    }
    res.status(401).json(output);
    return;
  }
  
  next();
});

export { checkAuthUserManagement };
