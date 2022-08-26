import { RedisClientType } from 'redis';
import { Actor } from './Actor';
import { DataStorage } from './dataStorage';
import { Item } from './Item';

export class RedisStorage implements DataStorage {
  private redis: RedisClientType;

  constructor(redisClient: RedisClientType) {
    this.redis = redisClient;
  }

  async getItem(id: string): Promise<Item|null> {
    const tags = await this.redis.sMembers(`items:${id}`);
    if (!tags) return null;
    return {
      externalId: id,
      tags,
    };
  }

  async deleteItem(id: string): Promise<void> {
    await this.redis.del(`items:${id}`);
  }

  async setItem(item: Item): Promise<void> {
    const exists = await this.redis.exists(`items:${item.externalId}`);
    if (exists) await this.redis.del(`items:${item.externalId}`);
    await this.redis.sAdd(`items:${item.externalId}`, item.tags);
  }

  async getActor(id: string): Promise<Actor | null> {
    const date = await this.redis.get(`actor:${id}`);
    if (!date) return null;
    return {
      externalId: id,
    };
  }

  async deleteActor(id: string): Promise<void> {
    await this.redis.del(`actor:${id}`);
  }

  async setActor(actor: Actor): Promise<void> {
    const exists = await this.redis.exists(`items:${actor.externalId}`);
    if (exists) await this.redis.del(`items:${actor.externalId}`);
    await this.redis.set(`actor:${actor.externalId}`, Date.now());
  }
}
