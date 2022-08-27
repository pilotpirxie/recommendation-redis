import 'dotenv';
import { Router } from 'express';
import Joi from 'joi';
import { TypedRequest } from '../types/express';
import validation from '../middlewares/validation';
import { DataStorage } from '../data/dataStorage';

export function initializeActorsController(dataStorage: DataStorage): Router {
  const router = Router();

  const addOrReplaceActorSchema = {
    body: {
      actorId: Joi.string().required(),
    },
  };

  router.post('/', validation(addOrReplaceActorSchema), async (req: TypedRequest<typeof addOrReplaceActorSchema>, res, next) => {
    try {
      await dataStorage.setActor(req.body.actorId);
      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    }
  });

  const deleteOrGetActorSchema = {
    params: {
      actorId: Joi.string().required(),
    },
  };

  router.delete('/:actorId', validation(deleteOrGetActorSchema), async (req: TypedRequest<typeof deleteOrGetActorSchema>, res, next) => {
    try {
      await dataStorage.deleteActor(req.params.actorId);
      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    }
  });

  router.get('/:actorId', validation(deleteOrGetActorSchema), async (req: TypedRequest<typeof deleteOrGetActorSchema>, res, next) => {
    try {
      const actor = await dataStorage.getActor(req.params.actorId);
      return res.json(actor);
    } catch (e) {
      return next(e);
    }
  });

  const addEventSchema = {
    params: {
      actorId: Joi.string().required(),
    },
    body: {
      ttl: Joi.number().required(),
      tag: Joi.string().required(),
      score: Joi.number().required(),
    },
  };

  router.post('/:actorId/events', validation(addEventSchema), async (req: TypedRequest<typeof addEventSchema>, res, next) => {
    try {
      const actor = await dataStorage.addEvent(
        req.params.actorId,
        req.body.tag,
        req.body.score,
        req.body.ttl,
      );
      return res.json(actor);
    } catch (e) {
      return next(e);
    }
  });

  return router;
}
