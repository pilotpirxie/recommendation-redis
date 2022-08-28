import 'dotenv';
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
    const tags = await this.redis.sMembers(`item:${id}`);
    if (!tags.length) return null;
    return {
      itemId: id,
      tags,
    };
  }

  async getItems(): Promise<Item[]> {
    const items: Item[] = [];
    for await (const key of this.redis.scanIterator({ MATCH: 'item:*' })) {
      const tags = await this.redis.sMembers(key);

      if (process.env.VERBOSE === 'true') {
        console.info('item:* Found', key, tags);
      }

      items.push({
        itemId: key.split(':')[1],
        tags,
      });

      if (items.length >= Number(process.env.ITEMS_LIMIT)) {
        break;
      }
    }

    return items;
  }

  async deleteItem(id: string): Promise<void> {
    await this.redis.del(`item:${id}`);
  }

  async setItem(id: string, tags: string[]): Promise<void> {
    const exists = await this.redis.exists(`item:${id}`);
    if (exists) await this.redis.del(`item:${id}`);
    await this.redis.sAdd(`item:${id}`, tags);
  }

  async getActor(id: string): Promise<Actor | null> {
    const exists = await this.redis.exists(`actor:${id}`);
    if (!exists) return null;

    const events: Event[] = [];
    for await (const key of this.redis.scanIterator({ MATCH: `actor:${id}:*` })) {
      const score = await this.redis.get(key);
      const [, , tag, ts, ttl] = key.split(':');

      if (process.env.VERBOSE === 'true') {
        console.info(`actor:${id}:* Found`, key, score);
      }

      events.push({
        score: Number(score),
        tag,
        ttl: Number(ttl),
        expireAt: Number(ts) + (Number(ttl) * 1000),
        createdAt: Number(ts),
      });

      if (events.length >= Number(process.env.EVENTS_LIMIT)) {
        break;
      }
    }

    return {
      actorId: id,
      events,
    };
  }

  async deleteActor(id: string): Promise<void> {
    let counter = 0;
    for await (const key of this.redis.scanIterator({ MATCH: `actor:${id}*` })) {
      await this.redis.del(key);
      counter++;
    }

    if (process.env.VERBOSE === 'true') {
      console.info(`actor:${id} Removed ${counter} actor key(s)`);
    }
  }

  async setActor(id: string): Promise<void> {
    await this.deleteActor(id);

    await this.redis.set(`actor:${id}`, Date.now().toString());
  }

  async addEvent(id: string, tag: string, score: number, ttl: number): Promise<void> {
    if (process.env.DO_NOT_CHECK_ACTOR_EXISTENCE !== 'true') {
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
