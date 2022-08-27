import { RedisClientType } from 'redis';
import { DataStorage } from './dataStorage';
import { Item } from '../domain/item';
import { Actor } from '../domain/actor';
import { Event } from '../domain/event';

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

  async setItem(id: string, tags: string[]): Promise<void> {
    const exists = await this.redis.exists(`items:${id}`);
    if (exists) await this.redis.del(`items:${id}`);
    await this.redis.sAdd(`items:${id}`, tags);
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

  async setActor(id: string): Promise<void> {
    await this.deleteActor(id);

    await this.redis.set(`actor:${id}`, Date.now().toString());
  }

  async addEvent(id: string, tag: string, score: number, ttl: number): Promise<void> {
    if (!process.env.DO_NOT_CHECK_ACTOR_EXISTENCE) {
      const exists = await this.redis.exists(`actor:${id}`);
      if (!exists) {
        return;
      }
    }

    const date = Date.now();
    await this.redis.set(`actor:${id}:${tag}:${date}:${ttl}`, score);
    if (ttl > 0) {
      await this.redis.expire(`actor:${id}:${tag}:${date}:${ttl}`, ttl);
    }
  }
}
