import EventEmitter from "node:events";
import Guild from "./structures/Guild";
import Message from "./structures/Message";
import TextableChannel from "./structures/TextableChannel";

export class EventClient {
    private events: EventEmitter;

    public constructor(captureRejections: boolean) {
        this.events = new EventEmitter({ captureRejections });
    }

    public on<T extends keyof ClientEvents>(event: T, listener: (...args: ClientEvents[T]) => void) {
        return this.events.on(event, listener as (...args: any[]) => void);
    }

    public emit<T extends keyof ClientEvents>(event: T, ...data: ClientEvents[T]) {
        return this.events.emit(event, ...data);
    }
}

export interface ClientEvents {
    ready: [];
    message_create: [Message<TextableChannel>];
    guild_create: [Guild]
};