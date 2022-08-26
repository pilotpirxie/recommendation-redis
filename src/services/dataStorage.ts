export type Item = {
    id?: number;
    externalId: string;
    tags: string[];
}

export type Actor = {
    id?: number;
    externalId: string;
}

export interface DataStorage {
    getItem(id: string): Promise<Item>;
    deleteItem(id: string): Promise<void>;
    replaceItem(item: Item): Promise<void>;
    addItem(item: Item): Promise<void>;

    getActor(id: string): Promise<Actor>;
    deleteActor(id: string): Promise<void>;
    replaceActor(actor: Actor): Promise<void>;
    addActor(actor: Actor): Promise<void>;
}
