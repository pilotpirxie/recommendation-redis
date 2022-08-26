import 'dotenv';
import { Router } from 'express';
import Joi from 'joi';
import { TypedRequest } from '../types/express';
import validation from '../middlewares/validation';
import { DataStorage } from '../data/dataStorage';

export function initializeItemsController(dataStorage: DataStorage): Router {
  const router = Router();

  const addItemSchema = {
    body: {
      externalId: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).required(),
    },
  };

  router.post('/', validation(addItemSchema), async (req: TypedRequest<typeof addItemSchema>, res, next) => {
    try {
      const status = await dataStorage.addItem({
        externalId: req.body.externalId,
        tags: req.body.tags,
      });
      return res.sendStatus(status ? 200 : 409);
    } catch (e) {
      return next(e);
    }
  });

  return router;
}
