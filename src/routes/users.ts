import { Router, Response, NextFunction } from "express";
import * as asyncHandler from "express-async-handler";
import { User } from "models/User";
import { checkAuthLevel, checkAuthParamMatch } from "middlewares/check-auth";
import { UserPrivilegeTypes } from "models/UserPrivilege";
import env from "env";
import { checkAuthUserManagement } from "middlewares/check-auth-users";

const usersRouter = Router();
const UserSessionParams = {
  userId: 'userId'
};

usersRouter
  .get('/', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
  }));


// login - create new session
usersRouter
  .post('/:userId/login', asyncHandler(async (req, res) => {
  
    const userId = parseInt(req.params.userId);
    const password = req.query.password;
    if (!userId || !password)
      return sendError(res, "No user id or password");
    
    // find the user, associate privileges 
    const user: User = await User.findByPk(userId, { include: ['privileges'] });
    if (!user)
      return sendError(res, "Unknown user id");
  
    // check password asynchronously
    const passwordMatch = await user.checkPassword(password);
    
    if (!passwordMatch)
      return sendError(res, "Password doesn't match");
    
    req.session.privileges = user.privileges.map(privilege => privilege.name);
    req.session.userId = userId;
    req.session.authed = true;
    req.session.companyId = user.companyId;

    res.status(200).json(user);
  }));


const getUserById = asyncHandler(async (req, res) => {

  // basic validation
  const userId = parseInt(req.params.userId);

  // find the user, associate privileges 
  const user: User = await User.findByPk(userId, { include: ['privileges', 'company'] });
  if (!user)
    return sendError(res, "User not found", 404);

  res.status(200).json(user);

});

usersRouter.get(
  '/:userId',
  checkAuthLevel(UserPrivilegeTypes.manager),
  checkAuthUserManagement,
  getUserById);

usersRouter.get(
  '/:userId',
  checkAuthParamMatch(UserSessionParams.userId, UserSessionParams.userId),
  getUserById);

const sendError = (res: Response, message: string, statusCode: number = 404) => {
  res.status(statusCode).json({ message });
};





export { usersRouter, UserSessionParams };