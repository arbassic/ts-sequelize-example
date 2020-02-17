import { Router, Request, Response } from "express";
import * as asyncHandler from "express-async-handler";
import { User } from "models/User";

const usersRouter = Router();

usersRouter
  .get('/', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
  }));

usersRouter.get('/:userId', asyncHandler( async (req, res) => {

  // basic validation
  const userId = parseInt(req.params.userId);
  const password = req.query.password;
  if (!userId || !password)
    return sendError(res, "No user id or password");
  
  // find the user, associate privileges 
  const user: User = await User.findByPk(userId, { include: ['privileges'] });
  if (!user)
    return sendError(res, "User not found");

  // check password asynchronously
  const passwordMatch = await user.checkPassword(password);
  
  if (!passwordMatch)
    return sendError(res, "Password doesn't match");
  
  res.status(200).json(user);
}));

const sendError = (res: Response, message: string) => {
  res.status(404).json({ message });
};

export { usersRouter };