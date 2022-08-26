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
    const tags = await this.redis.hGet(`items:${id}`, 'tags');
    if (tags) {
      return {
        externalId: id,
        tags: tags.split(','),
      };
    }
    return null;
  }

  async deleteItem(id: string): Promise<void> {
    await this.redis.del(`items:${id}`);
  }

  async replaceItem(item: Item): Promise<void> {
    await this.redis.hSet(`items:${item.externalId}`, 'tags', item.tags.join(','));
  }

  async addItem(item: Item): Promise<boolean> {
    const exists = await this.redis.exists(`items:${item.externalId}`);
    if (exists) return false;
    await this.redis.hSet(`items:${item.externalId}`, 'tags', item.tags.join(','));
    return true;
  }

  async getActor(id: string): Promise<Actor | null> {
    const date = await this.redis.hGet(`actor:${id}`, 'date');
    if (date) {
      return {
        externalId: id,
      };
    }
    return null;
  }

  async deleteActor(id: string): Promise<void> {
    await this.redis.del(`actor:${id}`);
  }

  async replaceActor(actor: Actor): Promise<void> {
    await this.redis.hSet(`actor:${actor.externalId}`, 'date', Date.now());
  }

  async addActor(actor: Actor): Promise<boolean> {
    const exists = await this.redis.exists(`actor:${actor.externalId}`);
    if (exists) return false;
    await this.redis.hSet(`actor:${actor.externalId}`, 'date', Date.now());
    return true;
  }
}
