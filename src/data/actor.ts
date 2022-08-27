import { Event } from './event';

export type AddActorPayload = {
    actorId: string;
}

export type Actor = {
    actorId: string;
    events: Event[];
}
