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
      itemId: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).required(),
    },
  };

  router.post('/', validation(addOrReplaceItemSchema), async (req: TypedRequest<typeof addOrReplaceItemSchema>, res, next) => {
    try {
      await dataStorage.setItem({
        itemId: req.body.itemId,
        tags: req.body.tags,
      });
      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    }
  });

  const deleteItemSchema = {
    params: {
      itemId: Joi.string().required(),
    },
  };

  router.delete('/:itemId', validation(deleteItemSchema), async (req: TypedRequest<typeof deleteItemSchema>, res, next) => {
    try {
      await dataStorage.deleteItem(req.params.itemId);
      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    }
  });

  router.get('/:itemId', validation(deleteItemSchema), async (req: TypedRequest<typeof deleteItemSchema>, res, next) => {
    try {
      const item = await dataStorage.getItem(req.params.itemId);
      return res.json(item);
    } catch (e) {
      return next(e);
    }
  });

  return router;
}
