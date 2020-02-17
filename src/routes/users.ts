import { Router, Request } from "express";
import * as asyncHandler from "express-async-handler";
import { User } from "models/User";

const usersRouter = Router();

usersRouter
  .get('/', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
  }));

usersRouter.get('/:userId', asyncHandler( async (req, res) => {
  const userId = parseInt(req.params.userId);
  const password = req.query.password;
  if (!userId || !password) {
    throw Error("No user id or password");
  }
  const user: User = await User.findByPk(userId, { include: ['privileges'] });
  if (!user) {
    throw Error("User not found");
  }
  const passwordMatch = await user.checkPassword(password);
  if (!passwordMatch) {
    throw Error("Password doesn't match");
  }
  res.status(200).json(user);
}));

export { usersRouter };