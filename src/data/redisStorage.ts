import { RedisClientType } from 'redis';
import { Actor, AddActorPayload } from './Actor';
import { DataStorage } from './dataStorage';
import { AddEventPayload, Event } from './event';
import { Item } from './Item';

export class RedisStorage implements DataStorage {
  private redis: RedisClientType;

  constructor(redisClient: RedisClientType) {
    this.redis = redisClient;
  }

  async getItem(id: string): Promise<Item|null> {
    const tags = await this.redis.sMembers(`items:${id}`);
    if (!tags.length) return null;
    return {
      itemId: id,
      tags,
    };
  }

  async deleteItem(id: string): Promise<void> {
    await this.redis.del(`items:${id}`);
  }

  async setItem(item: Item): Promise<void> {
    const exists = await this.redis.exists(`items:${item.itemId}`);
    if (exists) await this.redis.del(`items:${item.itemId}`);
    await this.redis.sAdd(`items:${item.itemId}`, item.tags);
  }

  async getActor(id: string): Promise<Actor | null> {
    const data = await this.redis.get(`actor:${id}`);
    if (!data) return null;

    const events: Event[] = [];
    for await (const key of this.redis.scanIterator({ MATCH: `actor:${id}:*` })) {
      const score = await this.redis.get(key);
      const [, , tag, ts, ttl] = key.split(':');

      if (process.env.VERBOSE) {
        console.info(`actor:${id}:* Found `, key, score);
      }

      events.push({
        score: Number(score),
        tag,
        ttl: Number(ttl),
        expireAt: Number(ts) + (Number(ttl) * 1000),
        createdAt: Number(ts),
      });
    }

    return {
      actorId: id,
      events,
    };
  }

  async deleteActor(id: string): Promise<void> {
    const exists = await this.redis.exists(`actor:${id}`);
    if (exists) {
      let counter = 0;
      for await (const key of this.redis.scanIterator({ MATCH: `actor:${id}*` })) {
        await this.redis.del(key);
        counter++;
      }

      if (process.env.VERBOSE) {
        console.info(`actor:${id} Removed ${counter} actor key(s)`);
      }
    }
  }

  async setActor(actor: AddActorPayload): Promise<void> {
    await this.deleteActor(actor.actorId);

    await this.redis.set(`actor:${actor.actorId}`, Date.now().toString());
  }

  async addEvent(actorId: string, event: AddEventPayload): Promise<void> {
    if (!process.env.DO_NOT_CHECK_ACTOR_EXISTENCE) {
      const exists = await this.redis.exists(`actor:${actorId}`);
      if (!exists) {
        return;
      }
    }

    const date = Date.now();
    await this.redis.set(`actor:${actorId}:${event.tag}:${date}:${event.ttl}`, event.score);
    if (event.ttl > 0) {
      await this.redis.expire(`actor:${actorId}:${event.tag}:${date}:${event.ttl}`, event.ttl);
    }
  }
}
