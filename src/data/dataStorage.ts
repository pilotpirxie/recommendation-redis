import { Item } from '../domain/item';
import { Actor } from '../domain/actor';

export interface DataStorage {
    getItem(id: string): Promise<Item | null>;
    getItems(): Promise<Item[]>;
    deleteItem(id: string): Promise<void>;
    setItem(id: string, tags: string[]): Promise<void>;

    getActor(id: string): Promise<Actor | null>;
    deleteActor(id: string): Promise<void>;
    setActor(id: string): Promise<void>;
    addEvent(id: string, tag: string, score: number, ttl: number): Promise<void>;
}
