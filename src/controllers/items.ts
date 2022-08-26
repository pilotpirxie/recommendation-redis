import 'dotenv';
import { Router } from 'express';
import Joi from 'joi';
import { TypedRequest } from '../types/express';
import validation from '../middlewares/validation';
import { DataStorage } from '../data/dataStorage';

export function initializeItemsController(dataStorage: DataStorage): Router {
  const router = Router();

  const addOrReplaceItemSchema = {
    body: {
      externalId: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).required(),
    },
  };

  router.post('/', validation(addOrReplaceItemSchema), async (req: TypedRequest<typeof addOrReplaceItemSchema>, res, next) => {
    try {
      await dataStorage.setItem({
        externalId: req.body.externalId,
        tags: req.body.tags,
      });
      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    }
  });

  return router;
}
