import 'dotenv';
import { Router } from 'express';
import Joi from 'joi';
import { TypedRequest } from '../types/express';
import validation from '../middlewares/validation';

const router = Router();

const addItemSchema = {
  body: {
    test: Joi.string().required(),
  },
};

router.post('/', validation(addItemSchema), async (req: TypedRequest<typeof addItemSchema>, res, next) => {
  try {
    return res.json({ status: 'ok' });
  } catch (e) {
    return next(e);
  }
});

export default router;
