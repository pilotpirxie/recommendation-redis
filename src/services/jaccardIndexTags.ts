import { Actor } from '../domain/actor';
import { Event } from '../domain/event';
import { Item } from '../domain/item';
import { Recommendation } from '../domain/recommendation';
import { RecommendationStrategy } from './recommendationStrategy';

export class JaccardIndexTags implements RecommendationStrategy {
  async getRecommendations(actor: Actor, items: Item[]): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    const maxTagScore = Number(process.env.JACCARD_MAX_TAG_SCORE);

    for (const item of items) {
      const jaccardIndex = this.getJaccardIndex(actor.events, item.tags, maxTagScore);
      if (jaccardIndex > 0) {
        recommendations.push({
          itemId: item.itemId,
          score: jaccardIndex,
          fromNoise: false,
        });
      }
    }

    return recommendations;
  }

  private getJaccardIndex(userEvents: Event[], itemTags: string[], maxTagScore: number): number {
    const totalItemTagsScore = itemTags.length * maxTagScore;

    let userTagsScore = 0;

    for (const event of userEvents) {
      if (itemTags.includes(event.tag)) {
        userTagsScore += event.score;
      }
    }

    return userTagsScore / totalItemTagsScore;
  }
}
