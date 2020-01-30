import { Response, Request, NextFunction } from "express";

// a middleware to accept content-type JSON only
export const onlyJson = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers["content-type"]?.indexOf('json') == -1) {
    res.status(406).json({
      error: 'Only application/json body is acceptable'
    });
    return;
  }
  next();
};
