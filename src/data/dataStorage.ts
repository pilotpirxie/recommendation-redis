import { Actor } from './Actor';
import { Item } from './Item';

export interface DataStorage {
    getItem(id: string): Promise<Item | null>;
    deleteItem(id: string): Promise<void>;
    replaceItem(item: Item): Promise<void>;
    addItem(item: Item): Promise<boolean>;

    getActor(id: string): Promise<Actor | null>;
    deleteActor(id: string): Promise<void>;
    replaceActor(actor: Actor): Promise<void>;
    addActor(actor: Actor): Promise<boolean>;
}
