// eslint-disable-next-line import/no-extraneous-dependencies
import {
  expect, test, describe, beforeAll,
} from '@jest/globals';
import { Actor } from '../domain/actor';
import { Item } from '../domain/item';
import { JaccardIndexTags } from '../services/jaccardIndexTags';

const recommendation = new JaccardIndexTags();

describe('Recommendations', () => {
  beforeAll(() => {
    process.env.EXPLORATION_NOISE = '0';
  });

  test('should item 1 has score 1 and be the first', () => {
    const items: Item[] = [
      {
        itemId: '1',
        tags: ['a', 'b'],
      },
      {
        itemId: '2',
        tags: ['a', 'c'],
      },
    ];
    const actor: Actor = {
      actorId: '1',
      events: [
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
        {
          tag: 'b', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
      ],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([{ itemId: '1', score: 1 }, { itemId: '2', score: 0.5 }]);
  });

  test('should item 2 has score 1 and be the first', () => {
    const items: Item[] = [
      {
        itemId: '1',
        tags: ['a', 'c'],
      },
      {
        itemId: '2',
        tags: ['a', 'b'],
      },
    ];
    const actor: Actor = {
      actorId: '1',
      events: [
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
        {
          tag: 'b', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
      ],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([{ itemId: '2', score: 1 }, { itemId: '1', score: 0.5 }]);
  });

  test('should return two recommendation with the same score of 1', () => {
    const items: Item[] = [
      {
        itemId: '1',
        tags: ['a', 'b'],
      },
      {
        itemId: '2',
        tags: ['a', 'b'],
      },
    ];
    const actor: Actor = {
      actorId: '1',
      events: [
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
        {
          tag: 'b', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
      ],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([{ itemId: '1', score: 1 }, { itemId: '2', score: 1 }]);
  });

  test('should return two recommendation with the same score of 0.5', () => {
    const items: Item[] = [
      {
        itemId: '1',
        tags: ['a', 'c'],
      },
      {
        itemId: '2',
        tags: ['a', 'c'],
      },
    ];
    const actor: Actor = {
      actorId: '1',
      events: [
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
        {
          tag: 'b', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
      ],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([{ itemId: '1', score: 0.5 }, { itemId: '2', score: 0.5 }]);
  });

  test('should return three recommendation with 1, 1 and 0.5 score', () => {
    const items: Item[] = [
      {
        itemId: '1',
        tags: ['a', 'b'],
      },
      {
        itemId: '2',
        tags: ['b', 'c'],
      },
      {
        itemId: '3',
        tags: ['c', 'd'],
      },
    ];
    const actor: Actor = {
      actorId: '1',
      events: [
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
        {
          tag: 'b', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
        {
          tag: 'c', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
      ],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([{ itemId: '1', score: 1 }, { itemId: '2', score: 1 }, { itemId: '3', score: 0.5 }]);
  });

  test('should return three 0 score recommendations', () => {
    const items: Item[] = [
      {
        itemId: '1',
        tags: ['a', 'b'],
      },
      {
        itemId: '2',
        tags: ['a', 'c'],
      },
      {
        itemId: '3',
        tags: ['c', 'd'],
      },
    ];
    const actor: Actor = {
      actorId: '1',
      events: [],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([{ itemId: '1', score: 0 }, { itemId: '2', score: 0 }, { itemId: '3', score: 0 }]);
  });

  test('should return 0 recommendations', () => {
    const items: Item[] = [];
    const actor: Actor = {
      actorId: '1',
      events: [
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
        {
          tag: 'b', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
        {
          tag: 'c', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
      ],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([]);
  });
});
