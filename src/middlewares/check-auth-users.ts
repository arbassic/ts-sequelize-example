import asyncHandler = require("express-async-handler");
import { NextFunction, Request, Response } from "express";
import { UserPrivilegeTypes } from "models/UserPrivilege";
import { User } from "models/User";
import env from "env";

const checkAuthUserSameCompany = asyncHandler(async (req, res, next: NextFunction) => {

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
  if (!authed) {

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
      output.hasPrivileges = req.session.privileges;
    }
    res.status(401).json(output);
    return;
  }
  
  next();
});

const checkAuthBasic = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.sessionID || !req.session.privileges || !req.session.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  next();
};


export { checkAuthUserSameCompany, checkAuthBasic };
