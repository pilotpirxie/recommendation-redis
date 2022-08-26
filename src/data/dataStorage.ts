import { Actor } from './Actor';
import { Item } from './Item';

export interface DataStorage {
    getItem(id: string): Promise<Item | null>;
    deleteItem(id: string): Promise<void>;
    setItem(item: Item): Promise<void>;

    getActor(id: string): Promise<Actor | null>;
    deleteActor(id: string): Promise<void>;
    setActor(actor: Actor): Promise<void>;
}
