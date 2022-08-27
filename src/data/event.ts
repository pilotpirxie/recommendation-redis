export type AddEventPayload = {
    tag: string;
    score: number;
    ttl: number;
}

export type Event = {
    tag: string;
    score: number;
    ttl: number;
    expireAt: number;
    createdAt: number;
}
