import { Response, Request, NextFunction } from "express";
import env from "env";
import { UserPrivilegeTypes } from "models/UserPrivilege";
import { User } from "models/User";

// regular authorization level check
export const checkAuthLevel = (level = 'any') => (req: Request, res: Response, next: NextFunction) => {

  if (!req.session || !req.session.privileges) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const privileges: string[] = req.session.privileges;
  const authed =
    level == 'any' ?
      privileges.length > 0 :
      privileges.includes(level) || privileges.includes(UserPrivilegeTypes.superadmin);
  
  if (!authed) {
    const output: any = { message: 'Unauthorized' };
    if (!env.isProd) {
      output.required = level;
      output.has = req.session.privileges;
    } 
    res.status(401).json(output);
    return;
  }
  
  next();
};

  // authorization by session[key] vs. req.params[key] verification
  export const checkAuthParamMatch = 
    (paramKeyInSession: string, paramKeyInRequest: string) => (req: Request, res: Response, next: NextFunction) => {

      if (!req.session || !req.session.privileges || !req.session[paramKeyInSession]) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      if (!paramKeyInRequest) {
        throw Error(`Got empty paramKeyInRequest`);
      }
      
      let authed = req.session.privileges.includes(UserPrivilegeTypes.superadmin);
      // required value
      const paramValue: string = req.params[paramKeyInRequest];
      // actual value in user session
      const sessionValue: string | string[] = req.session[paramKeyInSession];
      if (!authed) {
        if (Array.isArray(sessionValue)) {
          authed = sessionValue.includes(paramValue);
        } else {
          authed = paramValue == sessionValue;
        }
      }

      
      if (!authed) {
        const output: any = { message: 'Unauthorized' };
        if (!env.isProd) {
          output.required = sessionValue;
          output.has = paramValue;
        } 
        res.status(401).json(output);
        return;
      }
      
      next();
    };
