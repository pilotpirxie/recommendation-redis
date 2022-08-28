import { Actor } from '../domain/actor';
import { Event } from '../domain/event';
import { Item } from '../domain/item';
import { Recommendation } from '../domain/recommendation';
import { RecommendationStrategy } from './recommendationStrategy';

export class JaccardIndexTags implements RecommendationStrategy {
  getRecommendations(actor: Actor, items: Item[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const maxTagScore = Number(process.env.JACCARD_MAX_TAG_SCORE) || 1;

    for (const item of items) {
      const jaccardIndex = this.getJaccardIndex(actor.events, item.tags, maxTagScore);
      recommendations.push({
        itemId: item.itemId,
        score: jaccardIndex,
      });

      if (process.env.VERBOSE === 'true') {
        console.info('Scored', `actor:${actor.actorId}`, `item:${item.itemId}`, jaccardIndex);
      }
    }

    const explorationNoise = Number(process.env.EXPLORATION_NOISE) || 0;

    recommendations.sort((a, b) => {
      if (Math.random() < explorationNoise) {
        return Math.random() - 0.5;
      }
      return b.score - a.score;
    });

    const recommendationsLimit = Number(process.env.RECOMMENDATIONS_LIMIT) || 0;

    if (recommendationsLimit > 0 && recommendations.length > recommendationsLimit) {
      return recommendations.slice(0, Number(recommendationsLimit));
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

    if (process.env.JACCARD_CLAMP_RESULT_RECOMMENDATIONS === 'true') {
      return Math.max(Math.min(userTagsScore / totalItemTagsScore, 1), 0);
    }

    return userTagsScore / totalItemTagsScore;
  }
}
