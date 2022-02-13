import EventEmitter from "node:events";
import Guild from "./structures/Guild";
import GuildMember from "./structures/GuildMember";
import Message from "./structures/Message";
import TextableChannel from "./structures/TextableChannel";
import { PartialGuildMember } from "./structures/Types";

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
    shard_status_change: [status: "closed" | "connecting" | "connected", id: number];
    message_create: [message: Message<TextableChannel>];
    dm_recieve: [message: Message<any>];
    guild_create: [guild: Guild];
    member_update: [oldMember: PartialGuildMember, newMember: GuildMember];
    guild_member_boost: [member: GuildMember];
    guild_member_unboost: [member: GuildMember];
    error: [err: Error];
    ratelimit: [];
};