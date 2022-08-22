import 'dotenv';
import { Router } from 'express';
import Joi from 'joi';
import { TypedRequest } from '../types/express';
import validation from '../middlewares/validation';

const router = Router();

const searchSchema = {
  body: {
    outbound: Joi.date().required(),
    inbound: Joi.date().required(),
    originAirport: Joi.string().length(3).required(),
    numberOfAdults: Joi.number().min(1).max(5).required(),
    airline: Joi.string().length(3).required(),
  },
};

router.post('/', validation(searchSchema), async (req: TypedRequest<typeof searchSchema>, res, next) => {
  try {
    return res.json({ status: 'ok' });
  } catch (e) {
    return next(e);
  }
});

export default router;
