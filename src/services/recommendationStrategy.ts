import { Actor } from '../domain/actor';
import { Item } from '../domain/item';
import { Recommendation } from '../domain/recommendation';

export interface RecommendationStrategy {
    getRecommendations(actor: Actor, items: Item[]): Recommendation[];
}
