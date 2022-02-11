import { GatewayPresenceUpdateData, PresenceUpdateStatus } from "discord-api-types/v9";
import Client from "../Client";
import { PresenceActivities } from "./Types";

export class ClientPresenceHandler {
    private client: Client;

    public constructor (client: Client) {
        this.client = client;
    }

    public init(status: PresenceIndicators, options: PresenceOptionsWithShard | PresenceOptions[], afk?: boolean) {
        let presences: PresenceOptions[] = [];

        if (Array.isArray(options)) {
            presences.push(...options.map((val) => ({
                name: val.name,
                type: val.type,
                url: val.url
            })));
        } else {
            presences.push({
                type: options.type,
                name: options.name,
                url: options.url
            });
        }

        let data: GatewayPresenceUpdateData = {
            activities: presences,
            status: status as PresenceUpdateStatus,
            since: afk ? Date.now() : null,
            afk: afk ? true : false
        };

        let loopShards = () => {
            for (let shard of this.client.shards.values()) {
                shard.initStatus({ ...data });
            }
        }

        if (!Array.isArray(options) && options.shardId !== undefined) {
            this.client.shards.get(options.shardId)?.initStatus({ ...data });
        } else if (!Array.isArray(options)) {
            loopShards();
        } else {
            loopShards();
        }
    }
}

export type PresenceIndicators = "online" | "dnd" | "idle" | "offline";

export interface PresenceOptions {
    type: number | PresenceActivities;
    name: string;
    url?: string;
}

export interface PresenceOptionsWithShard extends PresenceOptions {
    shardId?: number;
}