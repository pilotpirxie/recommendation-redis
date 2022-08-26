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
    const date = await this.redis.get(`actor:${id}`);
    if (!date?.length) return null;
    return {
      actorId: id,
    };
  }

  async deleteActor(id: string): Promise<void> {
    await this.redis.del(`actor:${id}`);
  }

  async setActor(actor: Actor): Promise<void> {
    const exists = await this.redis.exists(`items:${actor.actorId}`);
    if (exists) await this.redis.del(`items:${actor.actorId}`);
    await this.redis.set(`actor:${actor.actorId}`, Date.now());
  }
}
