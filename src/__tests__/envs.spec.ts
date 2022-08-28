// eslint-disable-next-line import/no-extraneous-dependencies
import {
  expect, test, describe, beforeEach,
} from '@jest/globals';
import { Actor } from '../domain/actor';
import { Item } from '../domain/item';
import { JaccardIndexTags } from '../services/jaccardIndexTags';

const recommendation = new JaccardIndexTags();

describe('Envs', () => {
  beforeEach(() => {
    process.env.EXPLORATION_NOISE = '0';
    process.env.RECOMMENDATIONS_LIMIT = '100';
    process.env.JACCARD_MAX_TAG_SCORE = '1';
    process.env.JACCARD_CLAMP_RESULT_RECOMMENDATIONS = 'false';
  });

  test('should return one recommendation', () => {
    process.env.RECOMMENDATIONS_LIMIT = '1';

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
    expect(result).toHaveLength(1);
  });

  test('should return two recommendations', () => {
    process.env.RECOMMENDATIONS_LIMIT = '2';

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
        tags: ['a', 'c', 'd', 'e'],
      },
      {
        itemId: '4',
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
    expect(result).toHaveLength(2);
  });

  test('should return recommendation with 0.125 score', () => {
    process.env.JACCARD_MAX_TAG_SCORE = '8';

    const items: Item[] = [
      {
        itemId: '1',
        tags: ['a'],
      },
    ];
    const actor: Actor = {
      actorId: '1',
      events: [
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
      ],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([{ itemId: '1', score: 0.125 }]);
  });

  test('should return recommendation with 0.0625 score', () => {
    process.env.JACCARD_MAX_TAG_SCORE = '8';

    const items: Item[] = [
      {
        itemId: '1',
        tags: ['a', 'b'],
      },
    ];
    const actor: Actor = {
      actorId: '1',
      events: [
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
      ],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([{ itemId: '1', score: 0.0625 }]);
  });

  test('should clamp results to 0', () => {
    process.env.JACCARD_CLAMP_RESULT_RECOMMENDATIONS = 'true';

    const items: Item[] = [
      {
        itemId: '1',
        tags: ['a'],
      },
    ];
    const actor: Actor = {
      actorId: '1',
      events: [
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
        {
          tag: 'a', score: 1, ttl: 0, expireAt: 0, createdAt: 0,
        },
      ],
    };

    const result = recommendation.getRecommendations(actor, items);
    expect(result).toStrictEqual([{ itemId: '1', score: 1 }]);
  });
});
