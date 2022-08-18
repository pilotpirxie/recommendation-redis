import { NextFunction, Request, Response } from 'express';

/**
 * Handle unexpected errors
 * @param err
 * @param req
 * @param res
 * @param next
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err) {
    console.error(err.stack);
  }

  return res.sendStatus(500);
};
